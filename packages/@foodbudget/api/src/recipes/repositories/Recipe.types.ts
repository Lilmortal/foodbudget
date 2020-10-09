export type Cuisine =
  | 'American'
  | 'Italian'
  | 'Asian'
  | 'Mexican'
  | 'Southern and Soul Food'
  | 'French'
  | 'South-Western'
  | 'Barbeque'
  | 'Indian'
  | 'Chinese'
  | 'Cajun & Creole'
  | 'Mediterranean'
  | 'Greek'
  | 'English'
  | 'Spanish'
  | 'Thai'
  | 'German'
  | 'Moroccan'
  | 'Irish'
  | 'Japanese'
  | 'Cuban'
  | 'Hawaiian'
  | 'Swedish'
  | 'Hungarian'
  | 'Portuguese';

export type Diet =
  | 'Ketogenic'
  | 'Vegetarian (no meat, no eggs)'
  | 'Vegetarian (no meat, no dairy)'
  | 'Pescatarian'
  | 'Vegan'
  | 'Low Foodmap'
  | 'Vegetarian'
  | 'Paleo';

export type Allergy =
  | 'Gluten'
  | 'Peanut'
  | 'Seafood'
  | 'Sesame'
  | 'Soy'
  | 'Diary'
  | 'Egg'
  | 'Sulphite'
  | 'Tree Nut'
  | 'Wheat';

export interface Recipe {
  link: string;
  prepTime: string;
  servings: number;
  name: string;
  ingredients: string[];
  cuisines: Cuisine[];
  diets: Diet[];
  allergies: Allergy[];
}
