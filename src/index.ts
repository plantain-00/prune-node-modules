import minimist from 'minimist'
import * as fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import minimatch from 'minimatch'
import * as packageJson from '../package.json'

import { ConfigData } from './core'

let suppressError = false

function showToolVersion() {
  console.log(`Version: ${packageJson.version}`)
}

function showHelp() {
  console.log(`Version ${packageJson.version}
Syntax:   prune-node-modules [options] [file...]
Examples: prune-node-modules ./node_modules
          prune-node-modules ./node_modules --config prune-node-modules.config.js
          prune-node-modules ./node_modules --config prune-node-modules.config.ts
Options:
 -h, --help                                         Print this message.
 -v, --version                                      Print the version
 --config                                           Config file
`)
}

const defaultFiles = [
  'Makefile',
  'Gulpfile.js',
  'Gruntfile.js',
  'gulpfile.js',
  '.DS_Store',
  '.tern-project',
  '.gitattributes',
  '.editorconfig',
  '.eslintrc',
  'eslint',
  '.eslintrc.js',
  '.eslintrc.json',
  '.eslintignore',
  '.stylelitrc',
  '.htmllintrc',
  'htmllint.js',
  '.lint',
  '.npmignore',
  '.jshintrc',
  '.flowconfig',
  '.documentup.json',
  '.yarn-metadata.json',
  '.travis.yml',
  'appveyor.yml',
  '.gitlab-ci.yml',
  'circle.yml',
  '.coveralls.yml',
  'CHANGES',
  'LICENSE.txt',
  'LICENSE',
  'AUTHORS',
  'CONTRIBUTORS',
  '.yarn-integrity',
  '.yarnclean',
  '_config.yml',
  '.babelrc',
  '.yo-rc.json',
  'jest.config.js'
]

const defaultDirectories = [
  '__tests__',
  'test',
  'tests',
  'powered-test',
  'docs',
  'doc',
  '.idea',
  '.vscode',
  'website',
  'images',
  'assets',
  'example',
  'examples',
  'coverage',
  '.nyc_output',
  '.circleci',
  '.github'
]

const defaultExtensions = [
  '.md',
  '.ts',
  '.jst',
  '.coffee',
  '.tgz',
  '.swp'
]

function statAsync(file: string) {
  return new Promise<fs.Stats | undefined>((resolve) => {
    fs.stat(file, (error, stats) => {
      if (error) {
        resolve(undefined)
      } else {
        resolve(stats)
      }
    })
  })
}

let blacklist: string[] = []
let whitelist: string[] = []

async function prune(input: string) {
  if (whitelist.some(w => minimatch(input, w))) {
    return
  }
  return new Promise<void>(resolve => {
    if (blacklist.some(b => minimatch(input, b))) {
      rimraf(input, () => {
        resolve()
      })
      return
    }
    fs.stat(input, (statError, stats) => {
      if (statError) {
        resolve()
      } else if (stats.isDirectory()) {
        const basename = path.basename(input)
        if (defaultDirectories.some(d => d === basename)) {
          rimraf(input, () => {
            resolve()
          })
        } else {
          fs.readdir(input, (readdirError, files) => {
            if (readdirError) {
              resolve()
            } else {
              const fullPaths = files.map(f => path.resolve(input, f))
              Promise.all(fullPaths.map(p => prune(p))).then(() => {
                resolve()
              }, () => {
                resolve()
              })
            }
          })
          resolve()
        }
      } else if (stats.isFile()) {
        const basename = path.basename(input)
        const extensionname = path.extname(input)
        if (defaultFiles.some(f => f === basename) || defaultExtensions.some(e => e === extensionname)) {
          rimraf(input, () => {
            resolve()
          })
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  })
}

async function executeCommandLine() {
  const argv = minimist(process.argv.slice(2), { '--': true }) as unknown as {
    v?: unknown
    version?: unknown
    h?: unknown
    help?: unknown
    suppressError: boolean
    config?: string
    _: string[]
  }

  const showVersion = argv.v || argv.version
  if (showVersion) {
    showToolVersion()
    return
  }

  if (argv.h || argv.help) {
    showHelp()
    process.exit(0)
  }

  suppressError = argv.suppressError

  if (argv._.length !== 1) {
    throw new Error('need one target path')
  }
  const target = path.resolve(process.cwd(), argv._[0])

  try {
    let configFilePath: string
    if (argv.config) {
      configFilePath = path.resolve(process.cwd(), argv.config)
    } else {
      configFilePath = path.resolve(process.cwd(), 'prune-node-modules.config.ts')
      const stats = await statAsync(configFilePath)
      if (!stats || !stats.isFile()) {
        configFilePath = path.resolve(process.cwd(), 'prune-node-modules.config.js')
      }
    }
    if (configFilePath.endsWith('.ts')) {
      require('ts-node/register/transpile-only')
    }

    let configData: ConfigData & { default?: ConfigData } = require(configFilePath)
    if (configData.default) {
      configData = configData.default
    }
    
    if (configData.blacklist) {
      blacklist = configData.blacklist.map(b => path.resolve(target, b))
    }
    if (configData.whitelist) {
      whitelist = configData.whitelist.map(w => path.resolve(target, w))
    }
  } catch {
    // do nothing
  }

  await prune(target)
}

executeCommandLine().then(() => {
  console.log('prune-node-modules success.')
}, error => {
  if (error instanceof Error) {
    console.log(error.message)
  } else {
    console.log(error)
  }
  if (!suppressError) {
    process.exit(1)
  }
})
