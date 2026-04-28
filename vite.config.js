// import { defineConfig } from 'vite';
// import { ViteEjsPlugin } from 'vite-plugin-ejs';
// import { fileURLToPath } from 'node:url';
// import path from 'node:path';
// import { glob } from 'glob';
// import { readFileSync } from 'fs';
// import liveReload from 'vite-plugin-live-reload';
// import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
// import autoprefixer from 'autoprefixer';

// const jsonData = JSON.parse(readFileSync('./json/data.json'));

// function moveOutputPlugin() {
//   return {
//     name: 'move-output',
//     enforce: 'post',
//     apply: 'build',
//     async generateBundle(_, bundle) {
//       // for (const fileName in bundle) {
//       //   if (fileName.startsWith('pages/')) {
//       //     const newName = fileName.slice('pages/'.length);
//       //     bundle[fileName].fileName = newName;
//       //   }
//       // }
//     },
//   };
// }

// export default defineConfig({
//   plugins: [
//     liveReload(['./layout/**/*.ejs', './index.html', './pages/**/*.html']),
//     ViteEjsPlugin(jsonData),
//     moveOutputPlugin(),
//     ViteImageOptimizer({
//       png: { quality: 90 },
//       jpeg: { quality: 90 },
//       webp: { quality: 90 },
//     }),
//   ],
//   server: {
//     open: 'index.html',
//     host: true,
//   },
//   build: {
//     outDir: 'dist',
//     rollupOptions: {
//       input: {
//         index: path.resolve(__dirname, 'index.html'),
//         'uk/index': path.resolve(__dirname, 'uk/index.html'),
//         ...Object.fromEntries(
//           glob
//             .sync('pages/**/*.html')
//             .map((file) => [
//               path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
//               path.resolve(__dirname, file),
//             ])
//         ),
//       },
//       output: {
//         assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
//         chunkFileNames: 'assets/js/[name]-[hash].js',
//         entryFileNames: 'assets/js/[name]-[hash].js',
//       },
//     },
//   },
//   css: {
//     postcss: {
//       plugins: [autoprefixer()],
//     },
//     devSourcemap: true,
//   },
// });


import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import path from 'node:path';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import liveReload from 'vite-plugin-live-reload';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import autoprefixer from 'autoprefixer';

const jsonData = JSON.parse(readFileSync('./json/data.json'));

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
  plugins: [
    liveReload(['./layout/**/*.ejs', './index.html', './404.html', './pages/**/*.html', './uk/**/*.html']),
    ViteEjsPlugin(jsonData),
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
