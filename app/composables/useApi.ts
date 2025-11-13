interface ApiOptions extends RequestInit {
  useToken?: boolean;
  body?: any;
}

interface RefreshTokenResponse {
  accessToken: string;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseUrl;

  const toast = useToast();

  /**
   * Makes an API request with automatic token refresh on 401
   */
  const makeRequest = async <T = any>(
    endpoint: string,
    method: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const { useToken = true, body, ...fetchOptions } = options;

    // Helper to build headers
    const buildHeaders = (
      includeAuth: boolean = true
    ): Record<string, string> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Merge existing headers
      if (fetchOptions.headers) {
        const existingHeaders = new Headers(fetchOptions.headers);
        existingHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      }

      if (includeAuth && useToken) {
        const accessToken = useCookie("at").value;
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        } else {
          navigateTo("/auth/login");
          toast.add({
            title: "Authentication failed. Please login again.",
            color: "error",
          });
        }
      }

      return headers;
    };

    // Helper to make the actual fetch call
    const fetchData = async (includeAuth: boolean = true) => {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method,
        headers: buildHeaders(includeAuth),
        body: body ? JSON.stringify(body) : undefined,
        ...fetchOptions,
      });

      return response;
    };

    try {
      let response = await fetchData();

      // Handle 401 - Unauthorized
      if (response.status === 401 && useToken) {
        const refreshToken = useCookie("rt").value;

        if (!refreshToken) {
          toast.add({
            title: "No refresh token available",
            color: "error",
          });
        }

        // Attempt to refresh the access token
        try {
          const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.status !== 200) {
            throw new Error("Token refresh failed");
          } else {
            const refreshData: RefreshTokenResponse =
              await refreshResponse.json();

            // Store new access token
            const atCookie = useCookie("at", {
              secure: true,
              sameSite: "strict",
              maxAge: 60 * 15, // 15 minutes
            });
            atCookie.value = refreshData.accessToken;

            // Retry the original request with new token
            response = await fetchData();
          }
        } catch (refreshError) {
          // Clear tokens on refresh failure
          useCookie("at").value = null;
          useCookie("rt").value = null;
          useCookie("user").value = null;

          // Redirect to login or throw error
          navigateTo("/auth/login");
          toast.add({
            title: "Authentication failed. Please login again.",
            color: "error",
          });
        }
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.add({
          title:
            errorData.message ||
            `API Error: ${response.status} ${response.statusText}`,
          color: "error",
        });
      }

      // Parse and return response
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`API ${method} ${endpoint} failed:`, error);
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
    /**
     * GET request
     */
    get: <T = any>(endpoint: string, options?: Omit<ApiOptions, "body">) =>
      makeRequest<T>(endpoint, "GET", options),

    /**
     * POST request
     */
    post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
      makeRequest<T>(endpoint, "POST", { ...options, body }),

    /**
     * PUT request
     */
    put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
      makeRequest<T>(endpoint, "PUT", { ...options, body }),

    /**
     * PATCH request
     */
    patch: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
      makeRequest<T>(endpoint, "PATCH", { ...options, body }),

    /**
     * DELETE request
     */
    delete: <T = any>(endpoint: string, options?: Omit<ApiOptions, "body">) =>
      makeRequest<T>(endpoint, "DELETE", options),
  };
};
