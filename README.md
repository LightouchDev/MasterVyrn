# MasterVyrn

> Someday, Vyrn learned magic and became a very helpful companion.

<!-- [![Travis Build Status](https://travis-ci.org/LightouchDev/MasterVyrn.svg?branch=master)](https://travis-ci.org/LightouchDev/MasterVyrn) -->
[![CircleCI](https://circleci.com/gh/LightouchDev/MasterVyrn.svg?style=shield)](https://circleci.com/gh/LightouchDev/MasterVyrn) [![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/d77hk0cun4h5iw3n?svg=true)](https://ci.appveyor.com/project/MiauLightouch/mastervyrn) [![Bitrise Build Status](https://www.bitrise.io/app/7295fbc20a35511f/status.svg?token=gabvHK_3ltZM2xNoDVmGGg&branch=master)](https://www.bitrise.io/app/7295fbc20a35511f) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LightouchDev/MasterVyrn/blob/master/LICENSE)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[Download here](https://github.com/LightouchDev/MasterVyrn/releases)

MasterVyrn is a clean dedicated GBF loader build on top of electron.

## Feature

* **Keep clean**: MasterVyrn doesn't modify any game content. actually, it's as same as browser version of GBF.
  * only inject css to hide scrollbar
  * only hook ajax response to fetch info
  * only hook socket event to fetch raid info
* **Performance**: It's dedicated and no game throttling. (fight won't stop at current turn when program inactive.)
* **Work safe**: There's no different with regular Chromium.

## Problem

MasterVyrn is still in **alpha** stage:

* Not all Electron exports were removed. [#10](https://github.com/LightouchDev/MasterVyrn/issues/10)
* There's a big [MasterVyrn 1.0 Roadmap](https://github.com/LightouchDev/MasterVyrn/issues/15) pending, no new feature request is allowed.

## Supported Platform

* Mobage Account
* DMM Account (experimental, but recommended)*

\* Other than Mobage account login would make game loading faster, because even hidden mobage sidebar, it still cause very heavily performance drop when page loading, but this issue affected Mobage accounts only.

## Hotkey

* DevTools:
  * OSX: `Command + Alt + I`
  * Windows/Linux: `F12`
* Hide Sub Menu: `H`

## Thanks to

* Software framework: [Electron](https://electron.atom.io/)
* Front-end framework: [Vue.js](https://vuejs.org/)
* Icon framework: [Font Awesome 5](https://fontawesome.com)
* Localization support: [vue-i18n](https://github.com/kazupon/vue-i18n)
* Boilerplate: [electron-vue](https://github.com/SimulatedGREG/electron-vue)

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn dev

# build electron application for production
yarn build

# run unit & end-to-end tests
yarn test

# lint all JS/Vue component files in `src/`
yarn lint

```

## License

It's [MIT](https://github.com/LightouchDev/MasterVyrn/blob/master/LICENSE) literally, but [DBAD](https://github.com/philsturgeon/dbad) in mind.
