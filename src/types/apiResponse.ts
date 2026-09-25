
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
