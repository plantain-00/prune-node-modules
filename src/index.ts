import * as minimist from "minimist";
import * as fs from "fs";
import * as path from "path";
import rimraf = require("rimraf");
import * as packageJson from "../package.json";

let suppressError = false;

function printInConsole(message: any) {
    if (message instanceof Error) {
        message = message.message;
    }
    // tslint:disable-next-line:no-console
    console.log(message);
}

function showToolVersion() {
    printInConsole(`Version: ${packageJson.version}`);
}

const defaultFiles = [
    "Makefile",
    "Gulpfile.js",
    "Gruntfile.js",
    "gulpfile.js",
    ".DS_Store",
    ".tern-project",
    ".gitattributes",
    ".editorconfig",
    ".eslintrc",
    "eslint",
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintignore",
    ".stylelitrc",
    ".htmllintrc",
    "htmllint.js",
    ".lint",
    ".npmignore",
    ".jshintrc",
    ".flowconfig",
    ".documentup.json",
    ".yarn-metadata.json",
    ".travis.yml",
    "appveyor.yml",
    ".gitlab-ci.yml",
    "circle.yml",
    ".coveralls.yml",
    "CHANGES",
    "LICENSE.txt",
    "LICENSE",
    "AUTHORS",
    "CONTRIBUTORS",
    ".yarn-integrity",
    ".yarnclean",
    "_config.yml",
    ".babelrc",
    ".yo-rc.json",
    "jest.config.js",
];

const defaultDirectories = [
    "__tests__",
    "test",
    "tests",
    "powered-test",
    "docs",
    "doc",
    ".idea",
    ".vscode",
    "website",
    "images",
    "assets",
    "example",
    "examples",
    "coverage",
    ".nyc_output",
    ".circleci",
    ".github",
];

const defaultExtensions = [
    ".md",
    ".ts",
    ".jst",
    ".coffee",
    ".tgz",
    ".swp",
];

function prune(input: string) {
    return new Promise<void>(resolve => {
        fs.stat(input, (statError, stats) => {
            if (statError) {
                resolve();
            } else if (stats.isDirectory()) {
                const basename = path.basename(input);
                if (defaultDirectories.some(d => d === basename)) {
                    rimraf(input, unlinkError => {
                        resolve();
                    });
                } else {
                    fs.readdir(input, (readdirError, files) => {
                        if (readdirError) {
                            resolve();
                        } else {
                            const fullPaths = files.map(f => path.resolve(input, f));
                            Promise.all(fullPaths.map(p => prune(p))).then(() => {
                                resolve();
                            }, pruneError => {
                                resolve();
                            });
                        }
                    });
                    resolve();
                }
            } else if (stats.isFile()) {
                const basename = path.basename(input);
                const extensionname = path.extname(input);
                if (defaultFiles.some(f => f === basename) || defaultExtensions.some(e => e === extensionname)) {
                    rimraf(input, unlinkError => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    });
}

async function executeCommandLine() {
    const argv = minimist(process.argv.slice(2), { "--": true });

    const showVersion = argv.v || argv.version;
    if (showVersion) {
        showToolVersion();
        return;
    }

    suppressError = argv.suppressError;

    await Promise.all(argv._.map(f => prune(f)));
}

executeCommandLine().then(() => {
    printInConsole("prune-node-modules success.");
}, error => {
    printInConsole(error);
    if (!suppressError) {
        process.exit(1);
    }
});
