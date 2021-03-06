# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.3.6](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.3.5...@foodbudget/email@4.3.6) (2021-02-11)

**Note:** Version bump only for package @foodbudget/email





## [4.3.5](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.3.4...@foodbudget/email@4.3.5) (2020-11-24)

**Note:** Version bump only for package @foodbudget/email





## [4.3.4](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.3.3...@foodbudget/email@4.3.4) (2020-11-23)

**Note:** Version bump only for package @foodbudget/email





## [4.3.3](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.3.2...@foodbudget/email@4.3.3) (2020-11-06)

**Note:** Version bump only for package @foodbudget/email





## [4.3.2](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.3.1...@foodbudget/email@4.3.2) (2020-11-03)

**Note:** Version bump only for package @foodbudget/email





## [4.3.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.3.0...@foodbudget/email@4.3.1) (2020-11-01)

**Note:** Version bump only for package @foodbudget/email





# [4.3.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.6...@foodbudget/email@4.3.0) (2020-10-31)


### Features

* added relay to newly created frontend project ([c11bb6f](https://github.com/Lilmortal/foodbudget/commit/c11bb6f9dd351f220a0f0902d5eaab9464733502))
* jest use --project CLI to determine which tests to run ([75ac9e8](https://github.com/Lilmortal/foodbudget/commit/75ac9e89850f19688052635f0406e88ed83db24b))
* moved all back end related projects to backend folder ([0eab81a](https://github.com/Lilmortal/foodbudget/commit/0eab81a1a50239c2aa566acb64ad2377d281aa93))





## [4.2.6](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.5...@foodbudget/email@4.2.6) (2020-10-28)

**Note:** Version bump only for package @foodbudget/email





## [4.2.5](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.4...@foodbudget/email@4.2.5) (2020-10-28)

**Note:** Version bump only for package @foodbudget/email





## [4.2.4](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.3...@foodbudget/email@4.2.4) (2020-10-27)

**Note:** Version bump only for package @foodbudget/email





## [4.2.3](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.2...@foodbudget/email@4.2.3) (2020-10-26)

**Note:** Version bump only for package @foodbudget/email





## [4.2.2](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.1...@foodbudget/email@4.2.2) (2020-10-26)

**Note:** Version bump only for package @foodbudget/email





## [4.2.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.2.0...@foodbudget/email@4.2.1) (2020-10-26)


### Reverts

* Revert "chore: add release script to all packages" ([cd78946](https://github.com/Lilmortal/foodbudget/commit/cd789460dfde6ddfc73cddadb90f08ed02e52f72))





# [4.2.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.1.0...@foodbudget/email@4.2.0) (2020-10-24)


### Features

* add build script to all modules, transpile ts to js in /dist ([28eb354](https://github.com/Lilmortal/foodbudget/commit/28eb354ce6879195e9479a589ca448e78263d5fb))





# [4.1.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@4.0.0...@foodbudget/email@4.1.0) (2020-10-22)


### Features

* added appError and error packages ([0540d0a](https://github.com/Lilmortal/foodbudget/commit/0540d0a7224639d3212ddef5f92804200464d170))





# [4.0.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@3.0.0...@foodbudget/email@4.0.0) (2020-10-15)


### Bug Fixes

* merge conflict ([5f296e3](https://github.com/Lilmortal/foodbudget/commit/5f296e3fa85dc30eef07633c5f12f88aecc3635f))


### Code Refactoring

* moved Errors to its own packages ([b2fe0d1](https://github.com/Lilmortal/foodbudget/commit/b2fe0d1228feb2c392144d8dbfe50f56253f993a))


### BREAKING CHANGES

* Removed errors packages, added logger packages





# [3.0.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/email@2.0.0...@foodbudget/email@3.0.0) (2020-10-09)


### chore

* nexus POC ([3dc7d38](https://github.com/Lilmortal/foodbudget/commit/3dc7d38b0797aa1892e55aba6f35868ebfec1820))


### BREAKING CHANGES

* dockerize the applications, rename @foodbudget/app to @foodbudget/api





# 2.0.0 (2020-10-03)


### Bug Fixes

* dont load dotenv if CI env does not exist ([d87a2ae](https://github.com/Lilmortal/foodbudget/commit/d87a2aed984c2e59122228afe06c057d0cac9a5c))


### Code Refactoring

* split app, email, errors and jobs into different modules ([4aa0637](https://github.com/Lilmortal/foodbudget/commit/4aa0637a3091058fa22f19478ed770557daac4f7))


### BREAKING CHANGES

* Rework the Scrapers logic.
Added a new ServiceManager, this will be exposed for other modules to use.
(WIP)
