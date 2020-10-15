# Migration `20200915150642-update-id-to-serial`

This migration has been generated by Jack Tan at 9/16/2020, 3:06:42 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."recipe_adjectives" DROP CONSTRAINT "recipe_adjectives_recipe_id_fkey"

ALTER TABLE "public"."recipe_allergies" DROP CONSTRAINT "recipe_allergies_recipe_id_fkey"

ALTER TABLE "public"."recipe_cuisines" DROP CONSTRAINT "recipe_cuisines_recipe_id_fkey"

ALTER TABLE "public"."recipe_diets" DROP CONSTRAINT "recipe_diets_recipe_id_fkey"

ALTER TABLE "public"."recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipe_id_fkey"

ALTER TABLE "public"."user_allergies" DROP CONSTRAINT "user_allergies_user_id_fkey"

ALTER TABLE "public"."user_diets" DROP CONSTRAINT "user_diets_user_id_fkey"

ALTER TABLE "public"."user_pantries" DROP CONSTRAINT "user_pantries_user_id_fkey"

ALTER TABLE "public"."user_saved_recipes" DROP CONSTRAINT "user_saved_recipes_recipe_id_fkey"

ALTER TABLE "public"."user_saved_recipes" DROP CONSTRAINT "user_saved_recipes_user_id_fkey"

ALTER TABLE "public"."recipe_adjectives" DROP CONSTRAINT "recipe_adjectives_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "recipe_id",
ADD COLUMN "recipe_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."recipe_allergies" DROP CONSTRAINT "recipe_allergies_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "recipe_id",
ADD COLUMN "recipe_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."recipe_cuisines" DROP CONSTRAINT "recipe_cuisines_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "recipe_id",
ADD COLUMN "recipe_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."recipe_diets" DROP CONSTRAINT "recipe_diets_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "recipe_id",
ADD COLUMN "recipe_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "recipe_id",
ADD COLUMN "recipe_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."recipes" DROP CONSTRAINT "recipes_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."user_allergies" DROP CONSTRAINT "user_allergies_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "user_id",
ADD COLUMN "user_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."user_diets" DROP CONSTRAINT "user_diets_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "user_id",
ADD COLUMN "user_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."user_pantries" DROP CONSTRAINT "user_pantries_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "user_id",
ADD COLUMN "user_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."user_saved_recipes" DROP CONSTRAINT "user_saved_recipes_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL,
DROP COLUMN "user_id",
ADD COLUMN "user_id" integer   ,
DROP COLUMN "recipe_id",
ADD COLUMN "recipe_id" integer   ,
ADD PRIMARY KEY ("id")

ALTER TABLE "public"."users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "username",
ADD COLUMN "username" SERIAL,
ADD PRIMARY KEY ("username")

ALTER TABLE "public"."recipe_adjectives" ADD FOREIGN KEY ("recipe_id")REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."recipe_allergies" ADD FOREIGN KEY ("recipe_id")REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."recipe_cuisines" ADD FOREIGN KEY ("recipe_id")REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."recipe_diets" ADD FOREIGN KEY ("recipe_id")REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."recipe_ingredients" ADD FOREIGN KEY ("recipe_id")REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."user_allergies" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("username") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."user_diets" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("username") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."user_pantries" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("username") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."user_saved_recipes" ADD FOREIGN KEY ("recipe_id")REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."user_saved_recipes" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("username") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200915015706-experiment..20200915150642-update-id-to-serial
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model adjectives {
   adjectives_type   String              @id
@@ -36,50 +36,50 @@
   user_pantries      user_pantries[]
 }
 model recipe_adjectives {
-  id              String      @id
-  recipe_id       String?
+  id              Int         @id @default(autoincrement())
+  recipe_id       Int?
   adjectives_type String?
   adjectives      adjectives? @relation(fields: [adjectives_type], references: [adjectives_type])
   recipes         recipes?    @relation(fields: [recipe_id], references: [id])
 }
 model recipe_allergies {
-  id           String     @id
-  recipe_id    String?
+  id           Int        @id @default(autoincrement())
+  recipe_id    Int?
   allergy_type String?
   allergies    allergies? @relation(fields: [allergy_type], references: [allergy_type])
   recipes      recipes?   @relation(fields: [recipe_id], references: [id])
 }
 model recipe_cuisines {
-  id           String    @id
-  recipe_id    String?
+  id           Int       @id @default(autoincrement())
+  recipe_id    Int?
   cuisine_type String?
   cuisines     cuisines? @relation(fields: [cuisine_type], references: [cuisine_type])
   recipes      recipes?  @relation(fields: [recipe_id], references: [id])
 }
 model recipe_diets {
-  id        String   @id
-  recipe_id String?
+  id        Int      @id @default(autoincrement())
+  recipe_id Int?
   diet_type String?
   diets     diets?   @relation(fields: [diet_type], references: [diet_type])
   recipes   recipes? @relation(fields: [recipe_id], references: [id])
 }
 model recipe_ingredients {
-  id              String       @id
-  recipe_id       String?
+  id              Int          @id @default(autoincrement())
+  recipe_id       Int?
   ingredient_name String?
   quantity        Float
   ingredients     ingredients? @relation(fields: [ingredient_name], references: [ingredient_name])
   recipes         recipes?     @relation(fields: [recipe_id], references: [id])
 }
 model recipes {
-  id                 String               @id
+  id                 Int                  @id @default(autoincrement())
   recipe_name        String
   link               String
   prep_time          String
   servings           Float
@@ -92,41 +92,41 @@
   user_saved_recipes user_saved_recipes[]
 }
 model user_allergies {
-  id           String     @id
-  user_id      String?
+  id           Int        @id @default(autoincrement())
+  user_id      Int?
   allergy_type String?
   allergies    allergies? @relation(fields: [allergy_type], references: [allergy_type])
   users        users?     @relation(fields: [user_id], references: [username])
 }
 model user_diets {
-  id        String  @id
-  user_id   String?
+  id        Int     @id @default(autoincrement())
+  user_id   Int?
   diet_type String?
   diets     diets?  @relation(fields: [diet_type], references: [diet_type])
   users     users?  @relation(fields: [user_id], references: [username])
 }
 model user_pantries {
-  id              String       @id
-  user_id         String?
+  id              Int          @id @default(autoincrement())
+  user_id         Int?
   ingredient_name String?
   ingredients     ingredients? @relation(fields: [ingredient_name], references: [ingredient_name])
   users           users?       @relation(fields: [user_id], references: [username])
 }
 model user_saved_recipes {
-  id        String   @id
-  user_id   String?
-  recipe_id String?
+  id        Int      @id @default(autoincrement())
+  user_id   Int?
+  recipe_id Int?
   recipes   recipes? @relation(fields: [recipe_id], references: [id])
   users     users?   @relation(fields: [user_id], references: [username])
 }
 model users {
-  username           String               @id
+  username           Int                  @id @default(autoincrement())
   password           String
   nickname           String
   user_allergies     user_allergies[]
   user_diets         user_diets[]
```

