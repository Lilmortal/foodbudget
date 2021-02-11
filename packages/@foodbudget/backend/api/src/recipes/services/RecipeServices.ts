import { Edge, PageInfo, Pagination } from '../../types/pagination';
import { PaginationRepository } from '../../types/pagination/PaginationRepository';
import { PartialBy } from '../../types/PartialBy';
import { Recipe } from '../Recipe.types';

interface PaginateParams {
  pos: number;
  cursor?: string;
}

export class RecipeServices {
  constructor(private readonly repository: PaginationRepository<Recipe>) {
    this.repository = repository;
  }

  async get(recipeDto: Partial<Recipe>): Promise<Recipe[] | undefined> {
    const recipes = await this.repository.get(recipeDto);
    return recipes;
  }

  async paginateBefore({
    pos,
    cursor,
  }: PaginateParams): Promise<Pagination<Recipe> | undefined> {
    const beforeRecipes = await this.repository.paginate(
      -Math.abs(pos) - 1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const afterRecipes = await this.repository.paginate(
      1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const hasPreviousPage = beforeRecipes ? beforeRecipes.length > pos : false;
    const hasNextPage =
      cursor && afterRecipes ? afterRecipes.length > 0 : false;

    if (hasPreviousPage && pos !== 0) {
      beforeRecipes?.shift();
    }

    let edges: Edge<Recipe>[] = [];
    let startCursor: string | null = null;
    let endCursor: string | null = null;
    let totalCount = 0;

    if (beforeRecipes && beforeRecipes.length > 0) {
      edges = edges.concat(
        beforeRecipes.map((recipe) => ({
          node: { ...recipe },
          cursor: Buffer.from(recipe.link).toString('base64'),
        })),
      );

      startCursor = edges[0].cursor;
      endCursor = edges[edges.length - 1].cursor;

      totalCount = edges.length;
    }

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor,
      endCursor,
    };

    return { pageInfo, edges, totalCount };
  }

  async paginateAfter({
    pos,
    cursor,
  }: PaginateParams): Promise<Pagination<Recipe> | undefined> {
    const beforeRecipes = await this.repository.paginate(
      -1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const afterRecipes = await this.repository.paginate(
      pos + 1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const hasPreviousPage =
      cursor && beforeRecipes ? beforeRecipes.length > 0 : false;
    const hasNextPage = afterRecipes ? afterRecipes.length > pos : false;

    if (hasNextPage && pos !== 0) {
      afterRecipes?.pop();
    }

    let edges: Edge<Recipe>[] = [];
    let startCursor: string | null = null;
    let endCursor: string | null = null;
    let totalCount = 0;

    if (afterRecipes && afterRecipes.length > 0) {
      edges = edges.concat(
        afterRecipes.map((recipe) => ({
          node: { ...recipe },
          cursor: Buffer.from(recipe.link).toString('base64'),
        })),
      );

      startCursor = edges[0].cursor;
      endCursor = edges[edges.length - 1].cursor;

      totalCount = edges.length;
    }

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor,
      endCursor,
    };

    return { pageInfo, edges, totalCount };
  }

  async save(recipesDto: PartialBy<Recipe, 'id'>): Promise<Recipe>;

  async save(recipesDto: PartialBy<Recipe, 'id'>[]): Promise<Recipe[]>;

  async save(
    recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[],
  ): Promise<Recipe | Recipe[]>;

  async save(
    recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[],
  ): Promise<Recipe | Recipe[]> {
    if (Array.isArray(recipesDto)) {
      return Promise.all(
        recipesDto.map(async (recipe) => this.repository.save(recipe)),
      );
    }

    return this.repository.save(recipesDto);
  }
}
