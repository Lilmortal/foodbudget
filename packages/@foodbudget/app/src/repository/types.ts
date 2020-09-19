export interface Repository<T> {
  create: (obj: T) => Promise<boolean>;
}
