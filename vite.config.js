import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isMuncher = mode === "isMuncher";
  return {
    plugins: [react()],
    server: {
      port: 5174, // Unique port for new_project
      strictPort: true,
      host: "0.0.0.0",
      cors: true,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:19119", // Backend server
          changeOrigin: true, // Ensure the request appears to come from the frontend server
        },
      },
    },
    build: isMuncher
      ? {
          outDir: "src/components/textTranslationMuncher/munchersPackageExport",
          emptyOutDir: true,
          sourcemap: true,

          rollupOptions: {
            external: [
              "react",
              "react-dom",
              "react-router-dom",
              "pankosmia-rcl",
              "notistack",
              "proskomma-core",
            ],
            output: {
              name: "textTranslationMuncherRcl",
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react-router-dom": "ReactRouterDOM",
                "pankosmia-rcl": "pankosmiaRcl",
                notistack: "notistack",
              },
            },
          },

          lib: {
            entry: path.resolve(
              __dirname,
              "./src/components/textTranslationMuncher/muncher/index.js",
            ),
            name: "pankosmiaRcl",
            fileName: (format) => `text_translation-muncher-rcl.${format}.js`,
          },
        }
      : {
          outDir: "build",
          emptyOutDir: true,
          sourcemap: true,
        },
    base: "/clients/core-contenthandler_text_translation",
  };
});
