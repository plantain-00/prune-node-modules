module.exports = {
  include: [
    'bin/*',
    'dist/*.js',
    'demo/*',
    'package.json',
    'yarn.lock'
  ],
  exclude: [
  ],
  postScript: [
    'cd "[dir]" && yarn --production && yarn add ts-node -DE',
    'node [dir]/dist/index.js demo --supressError'
  ]
}
