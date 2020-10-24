# Migration `20201019032046-update-ingredient-to-be-singular-in-recipe-ingredients`

This migration has been generated by Jack Tan at 10/19/2020, 4:20:46 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201018124303-remove-prefix..20201019032046-update-ingredient-to-be-singular-in-recipe-ingredients
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 enum Cuisine {
   AMERICAN
@@ -77,9 +77,9 @@
 model recipe_ingredients {
   recipe_link     String
   ingredient_name String
   quantity        Float
-  ingredients     ingredients @relation(fields: [ingredient_name], references: [name])
+  ingredient      ingredients @relation(fields: [ingredient_name], references: [name])
   recipes         recipes     @relation(fields: [recipe_link], references: [link])
   @@id([recipe_link, ingredient_name])
 }
```

