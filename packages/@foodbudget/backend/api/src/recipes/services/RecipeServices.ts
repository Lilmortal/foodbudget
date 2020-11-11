import { Edge, PageInfo, Pagination } from '../../types/pagination';
import { PaginationRepository } from '../../types/pagination/PaginationRepository';
import { PartialBy } from '../../types/PartialBy';
import { Recipe } from '../Recipe.types';

interface PaginateParams {
  first?: number;
  last?: number;
  cursor?: string;
}

export class RecipeServices {
  constructor(private readonly repository : PaginationRepository<Recipe>) {
    this.repository = repository;
  }

  async get(recipeDto: Partial<Recipe>): Promise<Recipe[] | undefined> {
    const recipes = await this.repository.get(recipeDto);
    return recipes;
  }

  async paginate({ first, last, cursor }: PaginateParams): Promise<Pagination<Recipe> | undefined> {
    const beforePos = first || 0;
    const beforeRecipes = await this.repository.paginate(
      -Math.abs(beforePos) - 2, Buffer.from(cursor || '', 'base64').toString('ascii'),
    );

    const afterPos = last || 0;
    const afterRecipes = await this.repository.paginate(
      Math.abs(afterPos) + 1, Buffer.from(cursor || '', 'base64').toString('ascii'),
    );

    const hasPreviousPage = beforeRecipes ? beforeRecipes.length > beforePos : false;

    const hasNextPage = afterRecipes ? afterRecipes.length > afterPos : false;

    if (hasPreviousPage) {
      beforeRecipes?.shift();
    }

    if (hasNextPage) {
      afterRecipes?.pop();
    }

    let edges: Edge<Recipe>[] = [];

    if (beforeRecipes && beforeRecipes.length > 0) {
      edges = edges.concat(beforeRecipes.map((recipe) => ({
        node: { ...recipe },
        cursor: Buffer.from(`${recipe.id}`).toString('base64'),
      })));
    }

    if (afterRecipes && afterRecipes.length > 0) {
      edges = edges.concat(afterRecipes.map((recipe) => ({
        node: { ...recipe },
        cursor: Buffer.from(`${recipe.id}`).toString('base64'),
      })));
    }

    let startCursor = '';
    if (beforeRecipes && beforeRecipes.length > 0) {
      startCursor = Buffer.from(`${beforeRecipes[0].id}`).toString('base64');
    } else if (afterRecipes && afterRecipes.length > 0) {
      startCursor = Buffer.from(`${afterRecipes[0].id}`).toString('base64');
    }

    let endCursor = '';
    if (afterRecipes && afterRecipes.length > 0) {
      endCursor = Buffer.from(`${afterRecipes[afterRecipes.length - 1].id}`).toString('base64');
    } else if (beforeRecipes && beforeRecipes.length > 0) {
      endCursor = Buffer.from(`${beforeRecipes[beforeRecipes.length - 1].id}`).toString('base64');
    }

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor,
      endCursor,
    };

    const totalCount = edges ? edges.length : 0;

    return { pageInfo, edges, totalCount };
  }

  async save(recipesDto: PartialBy<Recipe, 'id'>): Promise<Recipe>;

  async save(recipesDto: PartialBy<Recipe, 'id'>[]): Promise<Recipe[]>;

  async save(recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[]): Promise<Recipe | Recipe[]>;

  async save(recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[]): Promise<Recipe | Recipe[]> {
    if (Array.isArray(recipesDto)) {
      return Promise.all(recipesDto.map(async (recipe) => this.repository.save(recipe)));
    }

    return this.repository.save(recipesDto);
  }
}
