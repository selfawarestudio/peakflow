const esbuild = require('esbuild')

// "main": "dist/module.cjs.js",
// "module": "dist/module.esm.js",
// "unpkg": "dist/cdn.min.js",

esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/cdn.min.js',
  bundle: true,
  minify: true,
  external: ['gsap'],
  platform: 'browser',
})

esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/module.esm.js',
  bundle: true,
  packages: 'external',
  platform: 'neutral',
})

esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/module.cjs.js',
  bundle: true,
  target: ['node10.4'],
  packages: 'external',
  platform: 'node',
})
