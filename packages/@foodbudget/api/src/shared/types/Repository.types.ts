export interface SaveOptions {
  override?: false;
}

export interface Repository<D, E> {
  get(obj: Partial<D>): Promise<E[] | undefined>;
  getOne(obj: Partial<D>): Promise<E | undefined>;

  save(obj: Partial<D>, options?: SaveOptions): Promise<E>;
  save(obj: Partial<D>[], options?: SaveOptions): Promise<E[]>;
  save(obj: Partial<D>| Partial<D>[], options?: SaveOptions): Promise<E | E[]>;

  delete(obj: string): Promise<E>;
  delete(obj: string[]): Promise<E[]>;
  delete(obj: string | string[]): Promise<E | E[]>;
}
