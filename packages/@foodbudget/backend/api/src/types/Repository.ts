import { SaveOptions } from './SaveOptions';

export interface Repository<D> {
  get(obj: Partial<D>): Promise<D[] | undefined>;
  getOne(obj: Partial<D>): Promise<D | undefined>;

  // TODO: Dont save immediately, think about Unit of work
  // How to handle 3 save operations and roll all of them back
  save(obj: Partial<D>, options?: SaveOptions): Promise<D>;
  save(obj: Partial<D>[], options?: SaveOptions): Promise<D[]>;
  save(obj: Partial<D>| Partial<D>[], options?: SaveOptions): Promise<D | D[]>;

  // TODO: Not all can delete
  delete(obj: string): Promise<D>;
  delete(obj: string[]): Promise<D[]>;
  delete(obj: string | string[]): Promise<D | D[]>;
}
