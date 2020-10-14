export interface Repository<T extends {id: number}> {
  getMany(obj: Partial<T>): Promise<T[] | undefined>;
  getOne(obj: Partial<T>): Promise<T | undefined>;

  create(obj: Omit<T, 'id'>): Promise<T>;
  create(obj: Omit<T, 'id'>[]): Promise<T[]>;
  create(obj: Omit<T, 'id'> | Omit<T, 'id'>[]): Promise<T | T[]>;

  update(obj: Omit<Partial<T>, 'id'>): Promise<T>;
  update(obj: Omit<Partial<T>, 'id'>[]): Promise<T[]>;
  update(obj: Omit<Partial<T>, 'id'> | Omit<Partial<T>, 'id'>[]): Promise<T | T[]>;

  delete(obj: Pick<T, 'id'>): Promise<T>;
  delete(obj: Pick<T, 'id'>[]): Promise<T[]>;
  delete(obj: Pick<T, 'id'> | Pick<T, 'id'>[]): Promise<T | T[]>;
}
