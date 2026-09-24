import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import path from 'node:path';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import liveReload from 'vite-plugin-live-reload';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import autoprefixer from 'autoprefixer';
import { createRequire } from 'module';
import { seoPlugin } from './scripts/seo-plugin.js';

const require = createRequire(import.meta.url);

const jsonData = JSON.parse(readFileSync('./json/data.json'));
// DEPLOY_ENV=dev → noindex, no analytics, form stub (spec REQ-022…025). Anything else = prod.
const deployEnv = process.env.DEPLOY_ENV === 'dev' ? 'dev' : 'prod';

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(_, bundle) {
    },
  };
}

const getInputFiles = () => {
  const inputFiles = {
    index: path.resolve(__dirname, 'index.html'),
    '404': path.resolve(__dirname, '404.html'),
    'uk/index': path.resolve(__dirname, 'uk/index.html'),
    'uk/404': path.resolve(__dirname, 'uk/404.html'),
  };

  const pageFiles = glob.sync('pages/**/*.html').reduce((acc, file) => {
    const name = path.relative('pages', file.slice(0, file.length - path.extname(file).length));
    acc[name] = path.resolve(__dirname, file);
    return acc;
  }, {});

  const ukFiles = glob.sync('uk/**/*.html').reduce((acc, file) => {
    const name = path.relative('.', file.slice(0, file.length - path.extname(file).length));
    acc[name] = path.resolve(__dirname, file);
    return acc;
  }, {});

  return { ...inputFiles, ...pageFiles, ...ukFiles };
};

export default defineConfig({
  define: { __DEPLOY_ENV__: JSON.stringify(deployEnv) },
  plugins: [
    liveReload(['./layout/**/*.ejs', './index.html', './404.html', './pages/**/*.html', './uk/**/*.html']),
    ViteEjsPlugin({ ...jsonData, deployEnv }),
    seoPlugin({ deployEnv }),
    moveOutputPlugin(),
    ViteImageOptimizer({
      png: { quality: 90 },
      jpeg: { quality: 90 },
      webp: { quality: 90 },
    }),
  ],
  server: {
    open: 'index.html',
    host: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getInputFiles(),
      output: {
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
    devSourcemap: true,
  },
});