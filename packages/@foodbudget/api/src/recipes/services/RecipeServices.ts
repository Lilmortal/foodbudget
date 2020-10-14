import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../Recipe.types';
import { RecipeServicesParams } from './RecipeServices.types';

const mapRecipe = (recipe: Recipe): Omit<recipes, 'id'> => {
  const mappedRecipe: Omit<recipes, 'id'> = {
    recipe_name: recipe.name,
    link: recipe.link,
    prep_time: recipe.prepTime,
    servings: recipe.servings,
    num_saved: recipe.numSaved,
  };

  return mappedRecipe;
};

export default class RecipeServices {
    private readonly repository: Repository<recipes>;

    constructor({ repository }: RecipeServicesParams) {
      this.repository = repository;
    }

    async get(recipeDto: Partial<Recipe>): Promise<recipes[] | undefined> {
      return this.repository.getMany(recipeDto);
    }

    async save(recipesDto: Recipe | Recipe[]): Promise<void> {
      if (Array.isArray(recipesDto)) {
        await Promise.all(recipesDto.map((recipe) => this.repository.create(mapRecipe(recipe))));
      } else {
        await this.repository.create(mapRecipe(recipesDto));
      }
    }
}
