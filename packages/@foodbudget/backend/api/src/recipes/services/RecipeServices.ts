import { Recipe } from '../Recipe.types';

export class RecipeServices {
  constructor(private readonly repository : Repository<Recipe>) {
    this.repository = repository;
  }

  async get(recipeDto: Partial<Recipe>): Promise<Recipe[] | undefined> {
    const recipes = await this.repository.get(recipeDto);
    return recipes;
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
