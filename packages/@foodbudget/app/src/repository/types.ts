export interface Repository<T> {
  create: (obj: T) => void;
}
