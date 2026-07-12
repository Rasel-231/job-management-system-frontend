// Mirrors the backend's TApiResponse contract exactly (backend/src/types/apiResponse.ts)
// so both sides agree on shape. Used to strictly type every API call's return value.
export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  meta?: TMeta;
  data?: T;
};
