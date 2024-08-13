import { fileURLToPath, URL } from 'node:url';
import { defineConfig, splitVendorChunkPlugin, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: './',
  plugins: [vue(), visualizer({ gzipSize: true }), splitVendorChunkPlugin()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      console: 'rollup-plugin-node-polyfills/polyfills/console',
      constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      domain: 'rollup-plugin-node-polyfills/polyfills/domain',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      os: 'rollup-plugin-node-polyfills/polyfills/os',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      sys: 'util',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  esbuild: {
    pure: ['console.log'],
    drop: ['debugger'],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        manualChunks: filepath => {
          if (filepath.includes('compiler-sfc.esm-browser')) return 'compiler-sfc-esm-browser';
          if (filepath.includes('@fortawesome')) return '@fortawesome';
        },
      },
    },
  },
}) as UserConfig;
