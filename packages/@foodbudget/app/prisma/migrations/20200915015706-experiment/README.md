# Migration `20200915015706-experiment`

This migration has been generated by Jack Tan at 9/15/2020, 1:57:06 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200915015706-experiment
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,135 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model adjectives {
+  adjectives_type   String              @id
+  recipe_adjectives recipe_adjectives[]
+}
+
+model allergies {
+  allergy_type     String             @id
+  recipe_allergies recipe_allergies[]
+  user_allergies   user_allergies[]
+}
+
+model cuisines {
+  cuisine_type    String            @id
+  recipe_cuisines recipe_cuisines[]
+}
+
+model diets {
+  diet_type    String         @id
+  recipe_diets recipe_diets[]
+  user_diets   user_diets[]
+}
+
+model ingredients {
+  ingredient_name    String               @id
+  price              Float
+  recipe_ingredients recipe_ingredients[]
+  user_pantries      user_pantries[]
+}
+
+model recipe_adjectives {
+  id              String      @id
+  recipe_id       String?
+  adjectives_type String?
+  adjectives      adjectives? @relation(fields: [adjectives_type], references: [adjectives_type])
+  recipes         recipes?    @relation(fields: [recipe_id], references: [id])
+}
+
+model recipe_allergies {
+  id           String     @id
+  recipe_id    String?
+  allergy_type String?
+  allergies    allergies? @relation(fields: [allergy_type], references: [allergy_type])
+  recipes      recipes?   @relation(fields: [recipe_id], references: [id])
+}
+
+model recipe_cuisines {
+  id           String    @id
+  recipe_id    String?
+  cuisine_type String?
+  cuisines     cuisines? @relation(fields: [cuisine_type], references: [cuisine_type])
+  recipes      recipes?  @relation(fields: [recipe_id], references: [id])
+}
+
+model recipe_diets {
+  id        String   @id
+  recipe_id String?
+  diet_type String?
+  diets     diets?   @relation(fields: [diet_type], references: [diet_type])
+  recipes   recipes? @relation(fields: [recipe_id], references: [id])
+}
+
+model recipe_ingredients {
+  id              String       @id
+  recipe_id       String?
+  ingredient_name String?
+  quantity        Float
+  ingredients     ingredients? @relation(fields: [ingredient_name], references: [ingredient_name])
+  recipes         recipes?     @relation(fields: [recipe_id], references: [id])
+}
+
+model recipes {
+  id                 String               @id
+  recipe_name        String
+  link               String
+  prep_time          String
+  servings           Float
+  num_saved          Float
+  recipe_adjectives  recipe_adjectives[]
+  recipe_allergies   recipe_allergies[]
+  recipe_cuisines    recipe_cuisines[]
+  recipe_diets       recipe_diets[]
+  recipe_ingredients recipe_ingredients[]
+  user_saved_recipes user_saved_recipes[]
+}
+
+model user_allergies {
+  id           String     @id
+  user_id      String?
+  allergy_type String?
+  allergies    allergies? @relation(fields: [allergy_type], references: [allergy_type])
+  users        users?     @relation(fields: [user_id], references: [username])
+}
+
+model user_diets {
+  id        String  @id
+  user_id   String?
+  diet_type String?
+  diets     diets?  @relation(fields: [diet_type], references: [diet_type])
+  users     users?  @relation(fields: [user_id], references: [username])
+}
+
+model user_pantries {
+  id              String       @id
+  user_id         String?
+  ingredient_name String?
+  ingredients     ingredients? @relation(fields: [ingredient_name], references: [ingredient_name])
+  users           users?       @relation(fields: [user_id], references: [username])
+}
+
+model user_saved_recipes {
+  id        String   @id
+  user_id   String?
+  recipe_id String?
+  recipes   recipes? @relation(fields: [recipe_id], references: [id])
+  users     users?   @relation(fields: [user_id], references: [username])
+}
+
+model users {
+  username           String               @id
+  password           String
+  nickname           String
+  user_allergies     user_allergies[]
+  user_diets         user_diets[]
+  user_pantries      user_pantries[]
+  user_saved_recipes user_saved_recipes[]
+}
```

