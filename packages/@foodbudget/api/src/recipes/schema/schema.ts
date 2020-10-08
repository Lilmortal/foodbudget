import {
  intArg,
  mutationField, objectType, queryField, stringArg,
} from '@nexus/schema';
import { Context } from '../../types/ApolloServer.types';
import { Recipe } from '../repository';

export const Book = objectType({
  name: 'Book',
  definition(t) {
    t.int('id', { description: 'Id boy' });
    t.string('title', { description: 'hmm' });
  },
});

export const Fish = objectType({
  name: 'fish',
  definition(t) {
    t.string('name');
  },
});

export const Test = queryField('test', {
  type: Book,
  resolve(_root, test, ctx) {
    console.log('test', ctx);
  },
});

export const mut = mutationField('create', {
  type: 'String',
  args: { name: stringArg({ required: true }) },
  resolve(_root, test, ctx: Context) {
    console.log(_root, test, ctx);
    return 'lol';
  },
});

export const RecipeType = objectType({
  name: 'recipe',
  definition(t) {
    t.string('name');
    t.string('test');
  },
});

export const getRecipes = queryField('recipes', {
  type: RecipeType,
  args: { name: stringArg({ required: true }) },
  resolve(_parent, args, ctx: Context) {
    return ctx.serviceManager.recipeServices.get(args.name);
  },
});

export const mutateRecipes = mutationField('recipes', {
  type: RecipeType,
  args: {
    name: stringArg({ required: true }),
    link: stringArg({ required: true }),
    prepTime: stringArg({ required: true }),
    servings: intArg({ required: true }),
    ingredients: stringArg({ required: true, list: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    const recipe: Recipe = {
      name: args.name,
      link: args.link,
      prepTime: args.prepTime,
      servings: args.servings,
      ingredients: args.ingredients,
      allergies: [],
      diets: [],
      cuisines: [],
    };

    let result;
    try {
      result = await ctx.serviceManager.recipeServices.save(recipe);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    return result;
  },
});
