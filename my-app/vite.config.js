import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimizations
    target: "es2015",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          icons: ["react-icons"],
          ai: ["@google/generative-ai"],
          utils: ["uuid"],
        },
        // Optimize chunk naming
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Reduce bundle size
    chunkSizeWarningLimit: 1000,
    // Optimize CSS
    cssCodeSplit: true,
    // Tree shaking
    treeshake: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-icons"],
  },
  // Server optimizations for development
  server: {
    port: 3000,
    host: true,
  },
  // Preview server for production testing
  preview: {
    port: 4173,
    host: true,
  },
});
