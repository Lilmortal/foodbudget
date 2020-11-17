import { onMapping } from './RecipesScraper';
import { ScrapedRecipe } from './RecipesScraper.types';

const getValidRecipePageInfo = (
  scrapedRecipe?: Partial<ScrapedRecipe>,
): ScrapedRecipe => ({
  prepTime: '5 min',
  servings: '4',
  name: 'Recipe name',
  numSaved: '0',
  ingredients: ['4 cups of water'],
  link: 'link',
  cuisines: [],
  diets: [],
  allergies: [],
  adjectives: [],
  meals: [],
  ...scrapedRecipe,
});

describe('recipe scraper', () => {
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
      numSaved: 0,
      ingredients: [{
        amount: 0,
        measurement: '',
        name: '',
        price: {
          amount: 0,
          currency: '',
        },
        text: '4 cups of water',
      }],
      link: 'link',
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    });
  });
});
