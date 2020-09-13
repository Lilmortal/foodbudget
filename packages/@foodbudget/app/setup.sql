CREATE TABLE IF NOT EXISTS Users (
    username VARCHAR(255) PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Ingredients (
    ingredient_name VARCHAR(255) PRIMARY KEY NOT NULL,
    price NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipes (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    prep_time VARCHAR(255) NOT NULL,
    servings NUMERIC NOT NULL,
    num_saved NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Pantries (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) REFERENCES Users(username),
    ingredient_name VARCHAR(255) REFERENCES Ingredients(ingredient_name)
);

CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id VARCHAR(255) REFERENCES Recipes(id),
    ingredient_name VARCHAR(255) REFERENCES Ingredients(ingredient_name),
    quantity NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS Cuisines (
    cuisine_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Cuisines (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id VARCHAR(255) REFERENCES Recipes(id),
    cuisine_type VARCHAR(255) REFERENCES Cuisines(cuisine_type)
);

CREATE TABLE IF NOT EXISTS Diets (
    diet_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Diets (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) REFERENCES Users(username),
    diet_type VARCHAR(255) REFERENCES Diets(diet_type)
);

CREATE TABLE IF NOT EXISTS Recipe_Diets (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id VARCHAR(255) REFERENCES Recipes(id),
    diet_type VARCHAR(255) REFERENCES Diets(diet_type)
);

CREATE TABLE IF NOT EXISTS Allergies (
    allergy_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Allergies (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) REFERENCES Users(username),
    allergy_type VARCHAR(255) REFERENCES Allergies(allergy_type)
);

CREATE TABLE IF NOT EXISTS Recipe_Allergies (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id VARCHAR(255) REFERENCES Recipes(id),
    allergy_type VARCHAR(255) REFERENCES Allergies(allergy_type)
);

CREATE TABLE IF NOT EXISTS Adjectives (
    adjectives_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Adjectives (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id VARCHAR(255) REFERENCES Recipes(id),
    adjectives_type VARCHAR(255) REFERENCES Adjectives(adjectives_type)
);

CREATE TABLE IF NOT EXISTS User_Saved_Recipes (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) REFERENCES Users(username),
    recipe_id VARCHAR(255) REFERENCES Recipes(id)
);