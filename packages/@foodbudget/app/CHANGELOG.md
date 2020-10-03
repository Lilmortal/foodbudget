# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/app@2.0.0...@foodbudget/app@2.0.1) (2020-10-03)

**Note:** Version bump only for package @foodbudget/app





# [2.0.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/app@1.2.0...@foodbudget/app@2.0.0) (2020-10-03)


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
