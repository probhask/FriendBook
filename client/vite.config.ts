/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import apiPlugin from "./vite-plugin-api";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load the full .env (incl. server-only vars) into process.env so the local
  // API function (vite-plugin-api) can read SANITY_WRITE_TOKEN / JWT_SECRET.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      react(),
      apiPlugin(),
      visualizer({ filename: "dist/stats.html", gzipSize: true }),
    ],
    resolve: {
      alias: {
        "@api": path.resolve(__dirname, "./src/api"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@container": path.resolve(__dirname, "./src/container"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@routes": path.resolve(__dirname, "./src/Routes"),
        "@redux": path.resolve(__dirname, "./src/redux"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@constants": path.resolve(__dirname, "./src/constants"),
      },
    },
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
            sanity: ["@sanity/client", "@sanity/image-url"],
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
      css: false,
    },
  };
});
