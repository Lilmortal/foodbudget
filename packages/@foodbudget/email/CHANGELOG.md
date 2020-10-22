# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
