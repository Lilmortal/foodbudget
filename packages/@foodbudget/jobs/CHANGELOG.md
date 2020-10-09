# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/jobs@2.0.1...@foodbudget/jobs@3.0.0) (2020-10-09)


### chore

* nexus POC ([3dc7d38](https://github.com/Lilmortal/foodbudget/commit/3dc7d38b0797aa1892e55aba6f35868ebfec1820))


### BREAKING CHANGES

* dockerize the applications, rename @foodbudget/app to @foodbudget/api





## [2.0.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/jobs@2.0.0...@foodbudget/jobs@2.0.1) (2020-10-03)

**Note:** Version bump only for package @foodbudget/jobs





# 2.0.0 (2020-10-03)


### Bug Fixes

* dont load dotenv if CI env does not exist ([d87a2ae](https://github.com/Lilmortal/foodbudget/commit/d87a2aed984c2e59122228afe06c057d0cac9a5c))


### Code Refactoring

* split app, email, errors and jobs into different modules ([4aa0637](https://github.com/Lilmortal/foodbudget/commit/4aa0637a3091058fa22f19478ed770557daac4f7))


### BREAKING CHANGES

* Rework the Scrapers logic.
Added a new ServiceManager, this will be exposed for other modules to use.
(WIP)
