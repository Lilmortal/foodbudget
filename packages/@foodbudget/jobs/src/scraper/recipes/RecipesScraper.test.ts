import { onMapping } from './RecipesScraper';
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
  it('should throw an Error if prepTime is an empty string', () => {
    expect(() => onMapping(getValidRecipePageInfo({ prepTime: '' }))).toThrowError();
  });

  it('should throw an Error if prepTime is an array', () => {
    expect(() => onMapping(getValidRecipePageInfo({ prepTime: ['5 mins'] }))).toThrowError();
  });

  it('should throw an Error if servings is an empty string', () => {
    expect(() => onMapping(getValidRecipePageInfo({ servings: '' }))).toThrowError();
  });

  it('should throw an Error if servings is an array', () => {
    expect(() => onMapping(getValidRecipePageInfo({ servings: ['4'] }))).toThrowError();
  });

  it('should throw an Error if servings is an invalid number', () => {
    expect(() => onMapping(getValidRecipePageInfo({ servings: '4g' }))).toThrowError();
  });

  it('should throw an Error if name is an empty string', () => {
    expect(() => onMapping(getValidRecipePageInfo({ name: '' }))).toThrowError();
  });

  it('should throw an Error if name is an array', () => {
    expect(() => onMapping(getValidRecipePageInfo({ name: ['5 mins'] }))).toThrowError();
  });

  it('should throw an Error if ingredients is an empty array', () => {
    expect(() => onMapping(getValidRecipePageInfo({ ingredients: [] }))).toThrowError();
  });

  it('should throw an Error if ingredients is not an array', () => {
    expect(() => onMapping(getValidRecipePageInfo({ ingredients: '5 mins' }))).toThrowError();
  });

  it('should return a mapped recipe', () => {
    const mappedRecipe = onMapping(getValidRecipePageInfo());
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
