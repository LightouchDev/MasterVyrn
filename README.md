# MasterVyrn
> Someday, Vyrn learned magic and became a very helpful companion.

[![Travis Build Status](https://travis-ci.org/LightouchDev/MasterVyrn.svg?branch=master)](https://travis-ci.org/LightouchDev/MasterVyrn) [![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/d77hk0cun4h5iw3n?svg=true)](https://ci.appveyor.com/project/MiauLightouch/mastervyrn) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LightouchDev/MasterVyrn/blob/master/LICENSE)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[Download here](https://github.com/LightouchDev/MasterVyrn/releases)

MasterVyrn is a clean dedicated GBF loader build on top of electron.

## Feature

* **Clean**: MasterVyrn doesn't modify any game content. (only inject css into webview to hide scrollbar.)
* **Quick**: It's dedicated and no game throttling. (fight won't stop at current turn when you minimize program.)
* **Safe**: There's no different with regular Chrome/Chromium, any Electron exports were removed.

## Problem

MasterVyrn is still in **alpha** stage:

* Game view is bugged, fixes incoming.
* No capabilities to inspect incoming message like character status, raid information ...etc.
* Need suggestions for further development, please post issue with "*feature request*" label to let me know.

## Supported Platform

* Mobage Account

## Thanks to

* Software framework: [Electron](https://electron.atom.io/)
* Front-end framework: [Vue.js](https://vuejs.org/)
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
