import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from './base.rollup.config';
import pkg from './package.json';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import json from '@rollup/plugin-json';
import sourcemaps from 'rollup-plugin-sourcemaps';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onWarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onWarn(warning);

const nodeModules = 'node_modules/**';

const sourceMap = false;

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    preserveEntrySignatures: false,
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        format: 'esm',
        preprocess: autoPreprocess()
      }),
      resolve({
        extensions: ['.ts', '.js', '.node', '.mjs'],
        preferBuiltins: true,
        jsnext: true,
        main: true,
        browser: true,
        modulesOnly: true,
        dedupe: ['svelte']
      }),
      typescript({
        module: 'esnext',
        target: 'esnext',
        sourceMap
      }),
      commonjs({
        transformMixedEsModules: true,
        // exclude: ['node_modules/sapper/sapper-dev-client.js'],
        include: nodeModules,
        extensions: ['.js', '.ts', '.mjs']
      }),
      json({
        compact: !dev
      }),
      postcss({
        // extract: path.resolve(__dirname, 'dist/global.css'),
        extract: true,
        // modules: true,
        extensions: ['.css', '.sass', '.scss'],
        namedExports: true,
        use: [
          [
            'sass',
            {
              includePaths: [
                './src/styles',
                './node_modules'
              ]
            }
          ]
        ],
        // onImport: (id) => {
        //   console.log('import', id);
        // },
        plugins: [
          postcssImport,
          simplevars({ silent: true }),
          nested(),
          cssnext({ warnForDuplicates: false }),
          autoprefixer,
          cssnano()
        ],
        minimize: true,
        sourceMap: dev
      }),

      legacy && babel({
        extensions: ['.js', '.mjs', '.html', '.svelte', '.ts'],
        runtimeHelpers: true,
        exclude: ['node_modules/@babel/**'],
        presets: [
          [
            '@babel/preset-env', {
              targets: '> 0.25%, not dead'
            }]
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          [
            '@babel/plugin-transform-runtime', {
              useESModules: true
            }]
        ]
      }),
      sourcemaps(),

      !dev && terser({
        module: true
      })
    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      commonjs({ include: nodeModules, extensions: ['.js', '.ts', '.mjs'] }),
      typescript({
        module: 'esnext',
        target: 'esnext',
        sourceMap
      }),
      resolve({
        extensions: ['.ts', '.js', '.node', '.mjs'],
        preferBuiltins: true,
        jsnext: true,
        main: true,
        dedupe: ['svelte']
      }),
      svelte({
        generate: 'ssr',
        dev,
        format: 'esm',
        preprocess: autoPreprocess()
      }),
      json({
        compact: !dev
      }),
      sourcemaps()
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules || Object.keys(process.binding('natives'))
    ),

    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve({
        extensions: ['.ts', '.js', '.node', '.mjs'],
        preferBuiltins: true,
        jsnext: true,
        main: true,
        dedupe: ['svelte']
      }),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      commonjs({ include: nodeModules, extensions: ['.js', '.ts'] }),
      typescript({
        module: 'esnext',
        target: 'esnext',
        sourceMap
      }),
      sourcemaps(),
      !dev && terser()
    ],

    onwarn
  }
};
