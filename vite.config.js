import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"

const path = require("path")
export default defineConfig({
  plugins: [vue(), VitePWA()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 8090,
    proxy: {
      "/api": "http://localhost:24555"
    }
  }
})
