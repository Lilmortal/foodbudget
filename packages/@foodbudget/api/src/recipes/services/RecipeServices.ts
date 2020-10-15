import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../Recipe.types';
import { RecipeServicesParams } from './RecipeServices.types';

const mapRecipeEntityToDto = (recipe: recipes): Recipe => {
  const mappedRecipe: Recipe = {
    name: recipe.recipe_name,
    link: recipe.link,
    prepTime: recipe.prep_time,
    servings: recipe.servings,
    numSaved: recipe.num_saved,
    ingredients: [],
    cuisines: [],
    diets: [],
    allergies: [],
  };

  return mappedRecipe;
};

export default class RecipeServices {
    private readonly repository: Repository<Recipe, recipes>;

    constructor({ repository }: RecipeServicesParams) {
      this.repository = repository;
    }

    async get(recipeDto: Partial<Recipe>): Promise<Recipe[] | undefined> {
      const recipeEntities = await this.repository.getMany(recipeDto);
      if (recipeEntities) {
        return Promise.all(recipeEntities.map((recipe) => mapRecipeEntityToDto(recipe)));
      }
      return undefined;
    }

    async save(recipesDto: Recipe): Promise<Recipe>;

    async save(recipesDto: Recipe[]): Promise<Recipe[]>;

    async save(recipesDto: Recipe | Recipe[]): Promise<Recipe |Recipe[]>;

    async save(recipesDto: Recipe | Recipe[]): Promise<Recipe | Recipe[]> {
      if (Array.isArray(recipesDto)) {
        return Promise.all(recipesDto.map(async (recipe) => {
          const recipeEntity = await this.repository.create(recipe);
          return mapRecipeEntityToDto(recipeEntity);
        }));
      }
      const recipeEntity = await this.repository.create(recipesDto);
      return mapRecipeEntityToDto(recipeEntity);
    }
}
