import type { BaseResponse, BaseListResponse } from "#shared/types/base";

export interface Company {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CompanyListResponse = BaseResponse<BaseListResponse<Company>>;
