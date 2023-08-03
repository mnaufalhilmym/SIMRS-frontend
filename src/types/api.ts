export interface ResponseI<T> {
  error: string;
  pagination: PaginationI;
  data: T;
}

export interface PaginationI {
  count: number;
  limit: number;
  total: number;
}

export const paginationDefault = {
  count: 0,
  limit: 0,
  total: 0,
} as PaginationI;
