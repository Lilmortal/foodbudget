export interface Repository<T, R> {
  getMany(obj: Partial<T>): Promise<R[] | undefined>;
  getOne(obj: Partial<T>): Promise<R | undefined>;
  create(obj: T | T[]): Promise<void>;
}
