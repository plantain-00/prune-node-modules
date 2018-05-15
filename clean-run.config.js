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
    'cd "[dir]" && yarn --production',
    '[dir]/bin/prune-node-modules demo --supressError'
  ]
}
