# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/api@3.0.0...@foodbudget/api@4.0.0) (2020-10-15)


### Bug Fixes

* don't show id and password when querying users ([db32cb3](https://github.com/Lilmortal/foodbudget/commit/db32cb39e6aea55f7e3a0e3903b3d5ed13a13b10))
* merge conflict ([5f296e3](https://github.com/Lilmortal/foodbudget/commit/5f296e3fa85dc30eef07633c5f12f88aecc3635f))
* users login via google id ([d9a28b4](https://github.com/Lilmortal/foodbudget/commit/d9a28b47e54cde23bc804152d0890be3ceb76f65))


### Code Refactoring

* moved Errors to its own packages ([b2fe0d1](https://github.com/Lilmortal/foodbudget/commit/b2fe0d1228feb2c392144d8dbfe50f56253f993a))


### Features

* user can integrate normal registration with social login ([877b290](https://github.com/Lilmortal/foodbudget/commit/877b29072690c46802fda88d4df7578c66933013))
* user is able to login via facebook ([abebd79](https://github.com/Lilmortal/foodbudget/commit/abebd79c3b1daa44fca4b9c883c10d04a98157d7))
* users can now login from google ([89ac5fd](https://github.com/Lilmortal/foodbudget/commit/89ac5fd9de1b4c1183a16b60d2891dac737d3cd2))


### BREAKING CHANGES

* Removed errors packages, added logger packages





# 3.0.0 (2020-10-09)


### chore

* nexus POC ([3dc7d38](https://github.com/Lilmortal/foodbudget/commit/3dc7d38b0797aa1892e55aba6f35868ebfec1820))


### Features

* added winston logging tool, prettify error msg ([ec9e942](https://github.com/Lilmortal/foodbudget/commit/ec9e9420e19d31f794314bc6a1baaf265d0cb779))


### BREAKING CHANGES

* dockerize the applications, rename @foodbudget/app to @foodbudget/api





## [2.0.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/api@2.0.0...@foodbudget/api@2.0.1) (2020-10-03)

**Note:** Version bump only for package @foodbudget/api





# [2.0.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/api@1.2.0...@foodbudget/api@2.0.0) (2020-10-03)


### Bug Fixes

* dont load dotenv if CI env does not exist ([d87a2ae](https://github.com/Lilmortal/foodbudget/commit/d87a2aed984c2e59122228afe06c057d0cac9a5c))


### Code Refactoring

* Rework the Scrapers logic. Added a new ServiceManager, this will be exposed for other modules to use.


### BREAKING CHANGES

* Split app, email, errors and jobs into different modules ([4aa0637](https://github.com/Lilmortal/foodbudget/commit/4aa0637a3091058fa22f19478ed770557daac4f7))





# 1.1.0 (2020-09-28)


### Bug Fixes

* dont send an email if there is an email error ([df8ed84](https://github.com/Lilmortal/foodbudget/commit/df8ed84bde3c1d2d5b97019abb588d6402387e09))
* handle graceful shutdown of agenda mongo database ([d5a2d28](https://github.com/Lilmortal/foodbudget/commit/d5a2d284e5ad3c83e0344e52a4c2865fe4c1f9fb))


### Features

* added email sender service ([babf982](https://github.com/Lilmortal/foodbudget/commit/babf982de62da343849ef906744d42fb4308c46a))
* added job interface which will be the reference for all future jobs ([38ea85d](https://github.com/Lilmortal/foodbudget/commit/38ea85d35cd3e0c5f5ee7467580e4c007ded5fc7))
* added lerna packages ([0ed244e](https://github.com/Lilmortal/foodbudget/commit/0ed244e3e7f0687755d9c2964f16a5ce12672871))
* added POC for agenda.js ([d01ad71](https://github.com/Lilmortal/foodbudget/commit/d01ad710dcd56c5c9f193a5717b5db7c72ad6922))
* added POC for Prisma 2 ([c8f15e7](https://github.com/Lilmortal/foodbudget/commit/c8f15e74f8a8e6ed1d478ba2c4e5e483cd9bcd1d))
* added recipe scraper jobs ([28899ee](https://github.com/Lilmortal/foodbudget/commit/28899eed83ac739fcf111b38aaab8065c565da0d))
* added status errors ([0781507](https://github.com/Lilmortal/foodbudget/commit/0781507493002a24a2fadffba0bace4a63fd0cd9))
* handle puppeteer timeout errors ([12ddd4b](https://github.com/Lilmortal/foodbudget/commit/12ddd4b0c4fc40f126aac9123a2f236d0c2b4e82))
* save newly scraped recipe to database ([a0c4878](https://github.com/Lilmortal/foodbudget/commit/a0c4878e960c07e88078ae0721d4dd6a12298217))
* scrapeRecipes init commit ([b3d5fe8](https://github.com/Lilmortal/foodbudget/commit/b3d5fe8537d1f6d4f6f60a79b03bac7d560f1080))
* throw email error if failed to send emails ([fc1f153](https://github.com/Lilmortal/foodbudget/commit/fc1f153ccfb5d72ff4db2ba989e420fae1afba7a))