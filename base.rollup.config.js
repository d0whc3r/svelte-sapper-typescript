'use strict';

const __chunk_3 = require('sapper/dist/chunk3');

const sourcemap = __chunk_3.dev ? 'inline' : false;

const rollup = {
  dev: __chunk_3.dev,

  client: {
    input: () => {
      return `${__chunk_3.src}/client.ts`
    },

    output: () => {
      let dir = `${__chunk_3.dest}/client`;
      if (process.env.SAPPER_LEGACY_BUILD) {dir += `/legacy`;}

      return {
        dir,
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        format: 'esm',
        sourcemap
      };
    }
  },

  server: {
    input: () => {
      return {
        server: `${__chunk_3.src}/server.ts`
      };
    },

    output: () => {
      return {
        dir: `${__chunk_3.dest}/server`,
        format: 'cjs',
        sourcemap
      };
    }
  },

  serviceworker: {
    input: () => {
      return `${__chunk_3.src}/service-worker.ts`;
    },

    output: () => {
      return {
        file: `${__chunk_3.dest}/service-worker.js`,
        format: 'iife',
        sourcemap
      }
    }
  }
};

export default rollup;
