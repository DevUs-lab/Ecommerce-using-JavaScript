import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap's own SCSS still uses the older Sass APIs, which floods
        // the terminal with deprecation warnings. They come from inside
        // node_modules, so quietDeps silences them without hiding warnings
        // in our own stylesheets.
        quietDeps: true,
      },
    },
  },
})
