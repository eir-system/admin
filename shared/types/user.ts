import type { BaseResponse } from "#shared/types/base"

interface TokenResponse {
  access_token: string
  refresh_token: string
}

export interface Role {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  scope: string;
  permissions: Permission[];
  created_at: string;   
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  resource: Resource;
  action: Action;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


interface User {
    id: string
    username: string
    first_name: string
    last_name: string
    is_active: boolean
    roles: Role[]
    last_login_at: string
    created_at: string
    updated_at: string
}

export type LoginBaseResponse = BaseResponse<TokenResponse>
export type UserResponse = BaseResponse<User>

