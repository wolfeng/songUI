import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/songUI/' : '/',
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
});
