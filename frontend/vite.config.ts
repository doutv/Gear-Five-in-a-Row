import { defineConfig, splitVendorChunkPlugin, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

// The type declarations don't match up the the very odd actual structure.
import outputManifestRawImport, {
  type OutputManifestParam,
} from "rollup-plugin-output-manifest";
type OutputManifestPlugin = (param?: OutputManifestParam) => Plugin;
const outputManifest = (outputManifestRawImport as any)
  .default as OutputManifestPlugin;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "./",
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    preview: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
      // manifest: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('@polkadot') ||
              id.includes('@substrate') ||
              id.includes('@scure') ||
              id.includes('@noble')
            ) {
              return 'polkadot';
            }
            if (id.includes('@open-ish') || id.includes('tslib')) {
              return '@open-ish';
            }
            if (id.includes('react-router') || id.includes('@remix-run')) {
              return '@react-router';
            }
            if (id.includes('@headlessui') || id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'app-ui';
            }
            if (id.includes('@gear-js') || id.includes('react-transition-group')) {
              return '@gear-js';
            }
            if (id.includes('@sentry')) {
              return '@sentry';
            }
          },
        },
      },
    },
    plugins: [splitVendorChunkPlugin(), svgr(), react(), nodePolyfills(), eslint(), outputManifest({ filter: () => true })],
    assetsInclude: ['**/*.wasm?inline', '**/*.txt?inline'],
  };
});
