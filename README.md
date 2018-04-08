# prune-node-modules

[![Dependency Status](https://david-dm.org/plantain-00/prune-node-modules.svg)](https://david-dm.org/plantain-00/prune-node-modules)
[![devDependency Status](https://david-dm.org/plantain-00/prune-node-modules/dev-status.svg)](https://david-dm.org/plantain-00/prune-node-modules#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/prune-node-modules.svg?branch=master)](https://travis-ci.org/plantain-00/prune-node-modules)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/prune-node-modules?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/prune-node-modules/branch/master)
[![npm version](https://badge.fury.io/js/prune-node-modules.svg)](https://badge.fury.io/js/prune-node-modules)
[![Downloads](https://img.shields.io/npm/dm/prune-node-modules.svg)](https://www.npmjs.com/package/prune-node-modules)

A CLI tool to prune node_modules.

## install

`yarn global add prune-node-modules`

## usage

run `prune-node-modules ./node_modules` or `prune-node-modules ./node_modules --config prune-node-modules.config.js`

## config

key | type | description
--- | --- | ---
blacklist | string[]? | the blacklist files, support glob
whitelist | string[]? | the whitelist files, support glob
