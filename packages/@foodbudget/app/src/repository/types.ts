export interface Repository<T> {
  create(obj: T | T[]): Promise<void>;
}
