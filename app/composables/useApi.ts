import { parseTtl } from "#shared/utils/parseTtl";
import type { LoginBaseResponse } from "#shared/types/user";

interface ApiOptions extends RequestInit {
  useToken?: boolean;
  params?: Record<string, any>;
  body?: any;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseUrl;

  const toast = useToast();

  const buildQueryParams = (params?: Record<string, any>) => {
    if (!params) return "";
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.append(key, String(value));
      }
    });

    const str = qs.toString();
    return str ? `?${str}` : "";
  };

  const buildHeaders = (
    includeAuth: boolean = true,
    token: string = "",
    customHeaders?: HeadersInit
  ) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (customHeaders) {
      const h = new Headers(customHeaders);
      h.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (includeAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      const accessToken = useCookie("at").value;
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return headers;
  };

  const makeRequest = async <T = any>(
    endpoint: string,
    method: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const { useToken = true, body, params, ...fetchOptions } = options;

    const queryString = buildQueryParams(params);
    const url = `${baseURL}${endpoint}${queryString}`;

    const fetchData = async (
      includeAuth: boolean = true,
      token: string = ""
    ) => {
      return await fetch(url, {
        method,
        headers: buildHeaders(includeAuth, token, fetchOptions.headers),
        body: body ? JSON.stringify(body) : undefined,
        ...fetchOptions,
      });
    };

    try {
      let response = await fetchData(useToken);

      if (response.status === 401 && useToken) {
        const refreshToken = useCookie("rt").value;

        if (!refreshToken) {
          toast.add({ title: "No refresh token available", color: "error" });
          navigateTo("/auth/login");
          return {} as T;
        }

        try {
          const refreshResponse = await fetch(`${baseURL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.status !== 200) {
            throw new Error("Token refresh failed");
          }

          const refreshData: LoginBaseResponse = await refreshResponse.json();

          const atCookie = useCookie("at", {
            httpOnly: false,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: parseTtl(config.public.accessTtl),
          });
          atCookie.value = refreshData.data?.access_token;

          response = await fetchData(true, refreshData.data?.access_token);
        } catch (_) {
          useCookie("at").value = null;
          useCookie("rt").value = null;
          useCookie("user").value = null;

          navigateTo("/auth/login");
          toast.add({
            title: "Authentication failed. Please login again.",
            color: "error",
          });

          return {} as T;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.add({
          title:
            errorData.message ||
            `API Error: ${response.status} ${response.statusText}`,
          color: "error",
        });
      }

      return (await response.json()) as T;
    } catch (error) {
      toast.add({
        title: "Xatolik",
        description:
          error instanceof Error
            ? error.message
            : "Kutilmagan xatolik yuz berdi",
        color: "error",
      });

      return {} as T;
    }
  };

  return {
    get: <T = any>(endpoint: string, options?: Omit<ApiOptions, "body">) =>
      makeRequest<T>(endpoint, "GET", options),

    post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
      makeRequest<T>(endpoint, "POST", { ...options, body }),

    put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
      makeRequest<T>(endpoint, "PUT", { ...options, body }),

    patch: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
      makeRequest<T>(endpoint, "PATCH", { ...options, body }),

    delete: <T = any>(endpoint: string, options?: Omit<ApiOptions, "body">) =>
      makeRequest<T>(endpoint, "DELETE", options),
  };
};
