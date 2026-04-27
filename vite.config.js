const { defineConfig } = require("vite");
const tailwindcss = require("@tailwindcss/vite").default;

module.exports = defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
