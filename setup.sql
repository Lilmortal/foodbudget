CREATE TABLE IF NOT EXISTS Ingredients (
    ingredient_name VARCHAR(255) PRIMARY KEY NOT NULL,
    price NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Pantries (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id FOREIGN KEY REFERENCES Users(id),
    ingredient_name FOREIGN KEY REFERENCES Ingredients(ingredient_name)
);

CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id FOREIGN KEY REFERENCES Recipes(id),
    ingredient_id FOREIGN KEY REFERENCES Ingredients(id)
);

CREATE TABLE IF NOT EXISTS Cuisines (
    cuisine_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Cuisines (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id FOREIGN KEY REFERENCES Recipes(id),
    cuisine_type FOREIGN KEY REFERENCES Cuisines(cuisine_type),
);

CREATE TABLE IF NOT EXISTS Diets (
    diet_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Diets (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id FOREIGN KEY REFERENCES Users(id),
    diet_type VARCHAR(255) FOREIGN KEY REFERENCES Diets(diet_type)
);

CREATE TABLE IF NOT EXISTS Recipe_Diets (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id FOREIGN KEY REFERENCES Recipes(id),
    diet_type VARCHAR(255) FOREIGN KEY REFERENCES Diets(diet_type)
);

CREATE TABLE IF NOT EXISTS Allergies (
    allergy_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Allergies (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id FOREIGN KEY REFERENCES Users(id),
    allergy_type VARCHAR(255) FOREIGN KEY REFERENCES Allergies(allergy_type)
);

CREATE TABLE IF NOT EXISTS Recipe_Allergies (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id FOREIGN KEY REFERENCES Recipes(id),
    allergy_type VARCHAR(255) FOREIGN KEY REFERENCES Allergies(allergy_type)
);

CREATE TABLE IF NOT EXISTS Adjectives (
    adjectives_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Adjectives (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    recipe_id FOREIGN KEY REFERENCES Recipes(id),
    adjectives_type VARCHAR(255) FOREIGN KEY REFERENCES Adjectives(adjectives_type)
);

CREATE TABLE IF NOT EXISTS Recipes (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    ingredient_id FOREIGN KEY REFERENCES Ingredients(id),
    recipe_name VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    prep_time VARCHAR(255) NOT NULL,
    servings NUMERIC NOT NULL,
    num_saved NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Saved_Recipes (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id FOREIGN KEY REFERENCES Users(id),
    recipe_id FOREIGN KEY REFERENCES Recipes(id)
);

CREATE TABLE IF NOT EXISTS Users (
    username VARCHAR(255),
    password VARCHAR(255),
    nickname VARCHAR(255)
);