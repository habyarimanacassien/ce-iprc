import { resolve } from "path";
import { defineConfig } from "vite";

const src = (...segments) => resolve(__dirname, "src", ...segments);

export default defineConfig({
  root: "src/",
  envDir: "../",
  publicDir: "../public",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main:      src("index.html"),
        dashboard: src("dashboard.html"),
        savings:   src("savings.html"),
        loans:     src("loans.html"),
        interest:  src("interest.html"),
        profile:   src("profile.html"),
      },
    },
  },
});
