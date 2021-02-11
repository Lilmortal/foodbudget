# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.6.0...@foodbudget/ui@1.6.1) (2021-02-11)

**Note:** Version bump only for package @foodbudget/ui





# [1.6.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.5.0...@foodbudget/ui@1.6.0) (2021-02-10)


### Bug Fixes

* carousel items tabbable only if visible; removed horizontal and removeArrowsOnDeviceType props ([b7175b8](https://github.com/Lilmortal/foodbudget/commit/b7175b834159e008721e101fa6f4bb7961e32027))
* not highlighting cell that has same dates but not same periods ([48bdf70](https://github.com/Lilmortal/foodbudget/commit/48bdf7075ae93fe730e171e2a31c8d33de2be47f))


### Features

* added period text next to cells, rename Card to Cell ([0429f8c](https://github.com/Lilmortal/foodbudget/commit/0429f8c310aee2378b47c29c3a76a957945e4961))
* calendar cells is now draggable and swapable ([97ea4ff](https://github.com/Lilmortal/foodbudget/commit/97ea4fffe82fe440bcceaf599324a7cc53fafc54))
* change calendar logic to accomodate periods ([6f457b3](https://github.com/Lilmortal/foodbudget/commit/6f457b355db0cfe71714927dfae9615782eff6fc))
* disable drag when there are no recipes ([b66b9e8](https://github.com/Lilmortal/foodbudget/commit/b66b9e8e071dfda6c1bcbf5cf14a2e78a6018977))
* enable horizontal scrolling for calendar on smaller device, support onRemoveRecipe function ([29f650b](https://github.com/Lilmortal/foodbudget/commit/29f650b041db93b1be07c6175171828342964678))
* extract calendar to its generic component and RecipeCalendar implementation ([1d7a968](https://github.com/Lilmortal/foodbudget/commit/1d7a968f664966309422fc8c3eacc5177cb13cf9))
* migrate styled components to css modules ([813dff9](https://github.com/Lilmortal/foodbudget/commit/813dff9ab94e747b280857397d719731136c0587))
* migrate styled components to css modules ([c0a17a3](https://github.com/Lilmortal/foodbudget/commit/c0a17a3ba5069d6283e09b0250fd05d5aa404cbd))
* move calendar date to columns ([8ccdefe](https://github.com/Lilmortal/foodbudget/commit/8ccdefeae64f414ca4db9c70c0c7ee010f5cf07e))





# [1.5.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.4.0...@foodbudget/ui@1.5.0) (2021-01-17)


### Bug Fixes

* set focus on the previous slide once resize to a smaller breakpoint ([c9529d3](https://github.com/Lilmortal/foodbudget/commit/c9529d3f616746a61597bb89bde0ef9fa83cc202))
* **WIP:** carousel slide logic ([07c7140](https://github.com/Lilmortal/foodbudget/commit/07c714042db6cc41f5efea10cbfa3c52def387ca))
* prevent scrolling when arrow keys clicked on autocomplete ([fb88e2b](https://github.com/Lilmortal/foodbudget/commit/fb88e2bb9b091578b3e52dfa555ff5f173260447))


### Features

* add useVisibleSlides, number of visible slides changes depending on breakpoints ([d8fb9a6](https://github.com/Lilmortal/foodbudget/commit/d8fb9a6d526afd78a689f6cd0dc30f51724eb0ce))
* added removeArrowsOnDeviceType props ([45bd6fd](https://github.com/Lilmortal/foodbudget/commit/45bd6fd05f981c252722c6dec6a13aa402c39d17))
* carousel left and right arrows are disabled when it reaches the beginning/end of slides ([be9528c](https://github.com/Lilmortal/foodbudget/commit/be9528cb1c676b8590a6b020d9b238b5937e5ec7))
* carousel support breakpoints, disable transition animation on window resize ([d22f8c3](https://github.com/Lilmortal/foodbudget/commit/d22f8c3b019cb47acf41716a2136edb9b091694e))
* enable swippeable in carousel ([1f42ca2](https://github.com/Lilmortal/foodbudget/commit/1f42ca287205e0398d3bf5778789011efe3f48d7))
* focus on first/last visible slide when user navigate carousel via keyboard ([03b5d51](https://github.com/Lilmortal/foodbudget/commit/03b5d510e49dd699e06b9d19eda6be20223def68))
* moved numberOfSwipes to breakpoints ([b9110a4](https://github.com/Lilmortal/foodbudget/commit/b9110a48a163a81a33e5f04387af3fe3eba7c5b6))
* support autocomplete arrow keys navigation ([90133a9](https://github.com/Lilmortal/foodbudget/commit/90133a95bb50c5d5c507159a2206ebcaeb133fe4))





# [1.4.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.3.0...@foodbudget/ui@1.4.0) (2020-12-31)


### Bug Fixes

* close button incorrect position and buttongroup placement ([ab44073](https://github.com/Lilmortal/foodbudget/commit/ab44073c588b2a56c3a62373540f7224e75397a2))


### Features

* added AuthModal ([39a5722](https://github.com/Lilmortal/foodbudget/commit/39a572242d1a746ad2cb9db3da7e256ff38062d2))
* added modal component ([731f4b7](https://github.com/Lilmortal/foodbudget/commit/731f4b756d9a7e0b5ab73e594b7dbfb6df78e9cf))





# [1.3.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.2.0...@foodbudget/ui@1.3.0) (2020-12-22)


### Bug Fixes

* global styles to use props theme ([662d6fc](https://github.com/Lilmortal/foodbudget/commit/662d6fc30f21112ddd59989fedaa9bc434164412))


### Features

*  moved ingredient list to its own component ([8dbbfe5](https://github.com/Lilmortal/foodbudget/commit/8dbbfe55f577aca0f53549ea59b37ac034aaf08c))
* add search page storybook; media queries change from rem to em; moved ingredient list to its own component ([6415aa2](https://github.com/Lilmortal/foodbudget/commit/6415aa2b081d9a498cbaeff33bd91c86d5f07bd8))
* added AutoComplete component ([04ddb1f](https://github.com/Lilmortal/foodbudget/commit/04ddb1fd3ffc4087ec7c1adf70da0cf0aebe3b6a))
* added body background, extract formik components to form ([5cb8656](https://github.com/Lilmortal/foodbudget/commit/5cb865679c7923e691b0f88378323da6f92a7877))
* added Button component, along with scss cleanups ([12fc0e8](https://github.com/Lilmortal/foodbudget/commit/12fc0e807042fd76c9fe7069947c7a0ce5f67f17))
* added close button, dropdown can clear on select ([7dc145b](https://github.com/Lilmortal/foodbudget/commit/7dc145b4c22d4e06eb2cef43548b56899f0da8fd))
* added dollar sign to budget textfield ([d8cf37f](https://github.com/Lilmortal/foodbudget/commit/d8cf37f404a7580df6a9a25fe43cea3b82fc984f))
* added dropdown and pizza image, replaced remaining template strings with styled objects ([c0034b4](https://github.com/Lilmortal/foodbudget/commit/c0034b48f2d72bda2fd20e058ccb9d31147061c7))
* added formik and yup to handle search page form submission; added concat_yarn_lock.sh script ([23239c3](https://github.com/Lilmortal/foodbudget/commit/23239c32762487a4ffdeb21e4e23b5404ccd43c5))
* added inverse prop to button ([2643f6b](https://github.com/Lilmortal/foodbudget/commit/2643f6b3fd92da492ff11de5988b99329d64d29f))
* added primary and secondary colors to button ([e3ccde3](https://github.com/Lilmortal/foodbudget/commit/e3ccde3e307db0918e3f4b7c32e38087f5b27d24))
* added scss variables for typography, theme, spacings, colors, and breakpoints ([dae0eae](https://github.com/Lilmortal/foodbudget/commit/dae0eae1563bf4738fd3ab0a82d9f49098d0c27c))
* append ingredient to ingredient list when selected ([d706e23](https://github.com/Lilmortal/foodbudget/commit/d706e2308f48e4000ad810b9e15cc6f5fdb2e2d2))
* replace css modules with styled components, added default themes ([9c4a8fc](https://github.com/Lilmortal/foodbudget/commit/9c4a8fcb005c233afc68731ff276789547ba70ff))
* replaced all styled components template strings to objects, added favicons and templates ([08d303e](https://github.com/Lilmortal/foodbudget/commit/08d303e637eef25987d8f9137bbf73dec9e77175))
* replaced dropdown down arrow, added font faces ([d3b91a7](https://github.com/Lilmortal/foodbudget/commit/d3b91a73b7e88ace84a0d7b1807054b1ca602cf1))
* replaced logo, added fonts ([26566b2](https://github.com/Lilmortal/foodbudget/commit/26566b2e7407d0c5c7fcd2b5664161ed660e90ee))





# [1.2.0](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.1.3...@foodbudget/ui@1.2.0) (2020-11-17)


### Features

* migrate relay to apollo client, added shared schema folder ([afed021](https://github.com/Lilmortal/foodbudget/commit/afed021262c69e8cf77d998394445047a038f77a))





## [1.1.3](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.1.2...@foodbudget/ui@1.1.3) (2020-11-06)

**Note:** Version bump only for package @foodbudget/ui





## [1.1.2](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.1.1...@foodbudget/ui@1.1.2) (2020-11-03)

**Note:** Version bump only for package @foodbudget/ui





## [1.1.1](https://github.com/Lilmortal/foodbudget/compare/@foodbudget/ui@1.1.0...@foodbudget/ui@1.1.1) (2020-11-01)

**Note:** Version bump only for package @foodbudget/ui





# 1.1.0 (2020-10-31)


### Features

* added jest config to frontend ([4b2aacd](https://github.com/Lilmortal/foodbudget/commit/4b2aacdcad0ab260983b347f6ac27747abd3dae0))
* added relay to newly created frontend project ([c11bb6f](https://github.com/Lilmortal/foodbudget/commit/c11bb6f9dd351f220a0f0902d5eaab9464733502))
* init frontend project and storybook ([b663652](https://github.com/Lilmortal/foodbudget/commit/b663652e0af078340e97d33de50bd7d1c2469381))
* jest use --project CLI to determine which tests to run ([75ac9e8](https://github.com/Lilmortal/foodbudget/commit/75ac9e89850f19688052635f0406e88ed83db24b))
* support inline SVG ([ec45231](https://github.com/Lilmortal/foodbudget/commit/ec452314d2e6a62798f959ca68a4384f915f6df5))
