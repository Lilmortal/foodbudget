import { Repository } from '../Repository';

export interface PaginationRepository<D> extends Repository<D> {
  paginate(
    take: number,
    cursor?: string,
    skip?: number,
  ): Promise<D[] | undefined>;
}
