export interface Repository<T, R> {
  get(obj: Partial<T>): Promise<R[] | undefined>;
  create(obj: T | T[]): Promise<void>;
}
