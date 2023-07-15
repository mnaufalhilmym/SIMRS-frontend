export interface ResponseI<T> {
  error: string;
  pagination: PaginationI;
  data: T;
}

export interface PaginationI {
  total: number;
}
