export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | undefined;
  endCursor: string | undefined;
}
