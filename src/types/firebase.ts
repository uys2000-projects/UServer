export interface UDocument<T> {
  id: string;
  data: T;
  timestamp: number;
  utimestamp: number;
}
