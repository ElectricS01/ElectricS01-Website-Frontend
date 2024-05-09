import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: "BetterCommunications",
        short_name: "BetterComms",
        description: "A Better Communications platform",
        icons: [
          {
            src: "/img/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/img/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/img/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/img/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/img/apple-touch-icon-60x60.png",
            sizes: "60x60",
            type: "image/png"
          },
          {
            src: "/img/apple-touch-icon-76x76.png",
            sizes: "76x76",
            type: "image/png"
          },
          {
            src: "/img/apple-touch-icon-120x120.png",
            sizes: "120x120",
            type: "image/png"
          },
          {
            src: "/img/apple-touch-icon-152x152.png",
            sizes: "152x152",
            type: "image/png"
          },
          {
            src: "/img/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "/img/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "/img/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png"
          },
          {
            src: "/img/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png"
          },
          {
            src: "/img/msapplication-icon-144x144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "/img/mstile-150x150.png",
            sizes: "150x150",
            type: "image/png"
          }
        ],
        theme_color: "#282a2b",
        background_color: "#181a1b",
        display: "fullscreen",
        categories: ["social", "social networking", "games"],
        start_url: "/chat/1"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:24555"
    }
  }
})
