const { defineConfig } = require("vite");
const tailwindcss = require("@tailwindcss/vite").default;

module.exports = defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      }
    }
  }
});
