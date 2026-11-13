import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SongUI',
      fileName: (format) => (format === 'es' ? 'song-ui.js' : 'song-ui.cjs'),
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', '@song-ui/core', '@song-ui/tokens'],
      output: {
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'song-ui.css';
          return assetInfo.name ?? 'asset';
        }
      }
    }
  }
});
