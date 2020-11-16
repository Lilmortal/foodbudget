import { Edge } from './Edge';
import { PageInfo } from './PageInfo';

export interface Pagination<T> {
  pageInfo: PageInfo;
  edges: Edge<T>[];
  totalCount: number;
}
