/** NOTE: Vite 어플리케이션 동작 설정 파일
 * [참고] https://vitejs.dev/config/
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    extensions: [
      //확장자를 따로 명시하지 않아도 되게 하는 설정
      '.js',
      '.vue'
    ],
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: [autoprefixer({})]
  },
  server: {
    host: 'localhost',
    port: 8079 // Netlify 설정으로 8080 에서 변경
  }
})
