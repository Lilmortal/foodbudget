import { recipes } from '@prisma/client';
import Mapper from '../../shared/types/Mapper.types';
import { Recipe } from '../Recipe.types';

const recipeServicesMapper: Mapper<Recipe, recipes> = ({
  fromDto: (dto: Recipe): recipes => ({
    id: dto.id,
    recipe_name: dto.name,
    link: dto.link,
    prep_time: dto.prepTime,
    servings: dto.servings,
    num_saved: dto.numSaved,
  }),
  toDto: (entity: recipes): Recipe => ({
    id: entity.id,
    name: entity.recipe_name,
    link: entity.link,
    prepTime: entity.prep_time,
    servings: entity.servings,
    numSaved: entity.num_saved,
    ingredients: [],
    cuisines: [],
    diets: [],
    allergies: [],
  }),
});

export default recipeServicesMapper;
