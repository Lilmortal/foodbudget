import { Repository } from '../Repository';

export interface PaginationRepository<D> extends Repository<D> {
  paginate(take: number, cursor: string, skip?: boolean): Promise<D[] | undefined>;
}
