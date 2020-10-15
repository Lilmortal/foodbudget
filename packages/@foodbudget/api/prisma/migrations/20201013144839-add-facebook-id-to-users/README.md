# Migration `20201013144839-add-facebook-id-to-users`

This migration has been generated by Jack Tan at 10/14/2020, 3:48:39 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."users" ADD COLUMN "facebook_id" text   

CREATE UNIQUE INDEX "users.facebook_id_unique" ON "public"."users"("facebook_id")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201013073228-add-google-id-to-users..20201013144839-add-facebook-id-to-users
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
@@ -126,8 +126,9 @@
 model users {
   id                 Int                  @id @default(autoincrement())
   google_id          String?              @unique
+  facebook_id        String?              @unique
   email              String               @unique
   password           String?
   nickname           String?
   user_allergies     user_allergies[]
```

