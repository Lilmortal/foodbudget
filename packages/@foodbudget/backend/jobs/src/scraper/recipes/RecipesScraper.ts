import { Recipe } from '@foodbudget/api';
import Scraper from '../Scraper';
import { ScrapedRecipe } from './RecipesScraper.types';
import { onScrapedRecipeMapping } from './onScrapedRecipeMapping';
import { onScrapeRecipes } from './onScrapeRecipes';

export const recipesScraper = new Scraper
<ScrapedRecipe, Omit<Recipe, 'id'>>({ onScrape: onScrapeRecipes, onMapping: onScrapedRecipeMapping });
