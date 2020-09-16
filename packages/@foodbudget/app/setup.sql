CREATE TABLE IF NOT EXISTS Users (
    username VARCHAR(255) PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Ingredients (
    ingredient_name VARCHAR(255) PRIMARY KEY NOT NULL,
    price INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipes (
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    prep_time VARCHAR(255) NOT NULL,
    servings INT NOT NULL,
    num_saved INT NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Pantries (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT REFERENCES Users(username),
    ingredient_name VARCHAR(255) REFERENCES Ingredients(ingredient_name)
);

CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_id INT REFERENCES Recipes(id),
    ingredient_name VARCHAR(255) REFERENCES Ingredients(ingredient_name),
    quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Cuisines (
    cuisine_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Cuisines (
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_id INT REFERENCES Recipes(id),
    cuisine_type VARCHAR(255) REFERENCES Cuisines(cuisine_type)
);

CREATE TABLE IF NOT EXISTS Diets (
    diet_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Diets (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT REFERENCES Users(username),
    diet_type VARCHAR(255) REFERENCES Diets(diet_type)
);

CREATE TABLE IF NOT EXISTS Recipe_Diets (
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_id INT REFERENCES Recipes(id),
    diet_type VARCHAR(255) REFERENCES Diets(diet_type)
);

CREATE TABLE IF NOT EXISTS Allergies (
    allergy_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Allergies (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT REFERENCES Users(username),
    allergy_type VARCHAR(255) REFERENCES Allergies(allergy_type)
);

CREATE TABLE IF NOT EXISTS Recipe_Allergies (
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_id INT REFERENCES Recipes(id),
    allergy_type VARCHAR(255) REFERENCES Allergies(allergy_type)
);

CREATE TABLE IF NOT EXISTS Adjectives (
    adjectives_type VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Adjectives (
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_id INT REFERENCES Recipes(id),
    adjectives_type VARCHAR(255) REFERENCES Adjectives(adjectives_type)
);

CREATE TABLE IF NOT EXISTS User_Saved_Recipes (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT REFERENCES Users(username),
    recipe_id INT REFERENCES Recipes(id)
);