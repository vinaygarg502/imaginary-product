import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import compression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    build: {
      outDir: "build",

      // 🔥 Use Terser
      minify: isProd ? "terser" : false,

      sourcemap: false,

      cssCodeSplit: true,

      target: "esnext",

      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          safari10: true,
        },

        format: {
          comments: false,
        },
      },

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },

          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.name === "blockWorkers") {
              return "assets/blockWorkers.js";
            }
            return "assets/[name]-[hash].js";
          },

          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },

    plugins: [
      tsconfigPaths(),
      react(),

      // 🔥 Brotli Compression
      compression({
        algorithm: "brotliCompress",
        ext: ".br",
        threshold: 1024,
        deleteOriginFile: false,
      }),
    ],

    server: {
      port: 4028,
      host: "0.0.0.0",
      strictPort: true,
      allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});
