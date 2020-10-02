import { ScrapeError } from '@foodbudget/errors';
import { mapping } from './RecipesScraper';
import { ScrapedRecipe } from './RecipesScraper.types';

const getValidRecipePageInfo = (
  scrapedRecipe?: Partial<ScrapedRecipe>,
): ScrapedRecipe => ({
  prepTime: '5 min',
  servings: '4',
  name: 'Recipe name',
  ingredients: ['4 cups of water'],
  link: 'link',
  cuisines: [],
  diets: [],
  allergies: [],
  ...scrapedRecipe,
});

describe('recipe scraper', () => {
  it('should invalidate prepTime if it is an empty string', () => {
    expect(() => mapping(getValidRecipePageInfo({ prepTime: '' }))).toThrow(ScrapeError);
  });

  it('should invalidate prepTime if it is an array', () => {
    expect(() => mapping(getValidRecipePageInfo({ prepTime: ['5 mins'] }))).toThrow(ScrapeError);
  });

  it('should invalidate servings if it is an empty string', () => {
    expect(() => mapping(getValidRecipePageInfo({ servings: '' }))).toThrow(ScrapeError);
  });

  it('should invalidate servings if it is an array', () => {
    expect(() => mapping(getValidRecipePageInfo({ servings: ['4'] }))).toThrow(ScrapeError);
  });

  it('should invalidate servings if it is an invalid number', () => {
    expect(() => mapping(getValidRecipePageInfo({ servings: '4g' }))).toThrow(ScrapeError);
  });

  it('should invalidate name if it is an empty string', () => {
    expect(() => mapping(getValidRecipePageInfo({ name: '' }))).toThrow(ScrapeError);
  });

  it('should invalidate name if it is an array', () => {
    expect(() => mapping(getValidRecipePageInfo({ name: ['5 mins'] }))).toThrow(ScrapeError);
  });

  it('should invalidate ingredients if it is an empty array', () => {
    expect(() => mapping(getValidRecipePageInfo({ ingredients: [] }))).toThrow(ScrapeError);
  });

  it('should invalidate ingredients if it is not an array', () => {
    expect(() => mapping(getValidRecipePageInfo({ ingredients: '5 mins' }))).toThrow(ScrapeError);
  });

  it('should validate a valid recipe page info', () => {
    const mappedRecipe = mapping(getValidRecipePageInfo());
    expect(mappedRecipe).toEqual({
      prepTime: '5 min',
      servings: 4,
      name: 'Recipe name',
      ingredients: ['4 cups of water'],
      link: 'link',
      cuisines: [],
      diets: [],
      allergies: [],
    });
  });
});
