export interface Repository<T> {
  getMany(obj: Partial<T>): Promise<T[] | undefined>;
  getOne(obj: Partial<T>): Promise<T | undefined>;

  create(obj: Omit<T, 'id'>): Promise<T>;
  create(obj: Omit<T, 'id'>[]): Promise<T[]>;
  create(obj: Omit<T, 'id'> | Omit<T, 'id'>[]): Promise<T | T[]>;

  update(obj: Partial<T>): Promise<T>;
  update(obj: Partial<T>[]): Promise<T[]>;
  update(obj: Partial<T> | Partial<T>[]): Promise<T | T[]>;
}
