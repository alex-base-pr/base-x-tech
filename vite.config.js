import { defineConfig } from 'vite';
import imagemin from 'vite-plugin-imagemin';
import ViteWebp from 'vite-plugin-webp-generator'
import { ngrok } from 'vite-plugin-ngrok';

export default defineConfig({
  mimeTypes: {
    'woff2': 'font/woff2',
  },
  plugins: [
    imagemin({
        gifsicle: { optimizationLevel: 3 },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 },
        svgo: {},
    }),
    ViteWebp({
      extensions: ["png", "jpg"]
    })
   // ngrok('2tmOUcZtrRLL57D8NnoX2OknQd2_7zhrye3AkLZhgHzxhw6Qe')
  ],
  css: {
    preprocessorOptions: {
        scss: {

        },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
