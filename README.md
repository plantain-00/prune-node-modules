# prune-node-modules

[![Dependency Status](https://david-dm.org/plantain-00/prune-node-modules.svg)](https://david-dm.org/plantain-00/prune-node-modules)
[![devDependency Status](https://david-dm.org/plantain-00/prune-node-modules/dev-status.svg)](https://david-dm.org/plantain-00/prune-node-modules#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/prune-node-modules.svg?branch=master)](https://travis-ci.org/plantain-00/prune-node-modules)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/prune-node-modules?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/prune-node-modules/branch/master)
![Github CI](https://github.com/plantain-00/prune-node-modules/workflows/Github%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/prune-node-modules.svg)](https://badge.fury.io/js/prune-node-modules)
[![Downloads](https://img.shields.io/npm/dm/prune-node-modules.svg)](https://www.npmjs.com/package/prune-node-modules)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fplantain-00%2Fprune-node-modules%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/prune-node-modules)

A CLI tool to prune node_modules.

## install

`yarn global add prune-node-modules`

## usage

run `prune-node-modules ./node_modules` or `prune-node-modules ./node_modules --config prune-node-modules.config.js` or `prune-node-modules ./node_modules --config prune-node-modules.config.ts`

## options

key | description
--- | ---
--config | config file
-h,--help | Print this message.
-v,--version | Print the version

## config

key | type | description
--- | --- | ---
blacklist | string[]? | the blacklist files, support glob
whitelist | string[]? | the whitelist files, support glob

## change logs

```txt
// v2
can only support one target
blacklist and whitelist are relative to the target directory

// v1
support multiple targets
blacklist and whitelist are relative to current working directory
```
