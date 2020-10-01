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

describe('recipe scraper utils', () => {
  it('should invalidate prepTime if it is an empty string', () => {
    const validation = () => mapping(getValidRecipePageInfo({ prepTime: '' }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate prepTime if it is an array', () => {
    const validation = () => mapping(getValidRecipePageInfo({ prepTime: ['5 mins'] }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate servings if it is an empty string', () => {
    const validation = () => mapping(getValidRecipePageInfo({ servings: '' }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate servings if it is an array', () => {
    const validation = () => mapping(getValidRecipePageInfo({ servings: ['4'] }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate servings if it is an invalid number', () => {
    const validation = () => mapping(getValidRecipePageInfo({ servings: '4g' }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate name if it is an empty string', () => {
    const validation = () => mapping(getValidRecipePageInfo({ name: '' }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate name if it is an array', () => {
    const validation = () => mapping(getValidRecipePageInfo({ name: ['5 mins'] }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate ingredients if it is an empty array', () => {
    const validation = () => mapping(getValidRecipePageInfo({ ingredients: [] }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should invalidate ingredients if it is not an array', () => {
    const validation = () => mapping(getValidRecipePageInfo({ ingredients: '5 mins' }));
    expect(validation).toThrow(ScrapeError);
  });

  it('should validate a valid recipe page info', () => {
    const validation = () => mapping(getValidRecipePageInfo());
    expect(validation).not.toThrow(Error);
  });
});
