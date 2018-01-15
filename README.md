# MasterVyrn

> Someday, Vyrn learned magic and became a very helpful companion.

[![Travis Build Status](https://travis-ci.org/LightouchDev/MasterVyrn.svg?branch=master)](https://travis-ci.org/LightouchDev/MasterVyrn) [![Bitrise Build Status](https://www.bitrise.io/app/7295fbc20a35511f/status.svg?token=gabvHK_3ltZM2xNoDVmGGg&branch=master)](https://www.bitrise.io/app/7295fbc20a35511f) [![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/d77hk0cun4h5iw3n?svg=true)](https://ci.appveyor.com/project/MiauLightouch/mastervyrn) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LightouchDev/MasterVyrn/blob/master/LICENSE)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[Download here](https://github.com/LightouchDev/MasterVyrn/releases)

MasterVyrn is a clean dedicated GBF loader build on top of electron.

## Feature

* **Clean**: MasterVyrn doesn't modify any game content. (only inject css into webview to hide scrollbar.)
* **Quick**: It's dedicated and no game throttling. (fight won't stop at current turn when you minimize program.)
* **Safe**: There's no different with regular Chromium. (**WARNING**: but not all Electron exports were removed.) [#10](https://github.com/LightouchDev/MasterVyrn/issues/10)

## Problem

MasterVyrn is still in **alpha** stage:

* No capabilities to inspect websocket message like raid information.
* Need suggestions for further development, please post issue with "*feature request*" label to let me know.

## Supported Platform

* Mobage Account

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
