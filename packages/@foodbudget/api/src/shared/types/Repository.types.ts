export interface Repository<D, E extends {id: number}> {
  getMany(obj: Partial<D>): Promise<E[] | undefined>;
  getOne(obj: Partial<D>): Promise<E | undefined>;

  create(obj: Omit<D, 'id'>): Promise<E>;
  create(obj: Omit<D, 'id'>[]): Promise<E[]>;
  create(obj: Omit<D, 'id'> | Omit<E, 'id'>[]): Promise<E | E[]>;

  update(obj: Partial<D>): Promise<E>;
  update(obj: (Partial<D>)[]): Promise<E[]>;
  update(obj: Partial<D>| (Partial<D>)[]): Promise<E | E[]>;

  delete(id: number): Promise<E>;
  delete(id: number[]): Promise<E[]>;
  delete(id: number | number[]): Promise<E | E[]>;
}
