import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react": path.resolve(rootDir, "node_modules/react"),
      "react-dom": path.resolve(rootDir, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(rootDir, "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(rootDir, "node_modules/react/jsx-dev-runtime"),
      "react-native": "react-native-web",
      "@react-native-async-storage/async-storage": path.resolve(__dirname, "src/asyncStorageMock.js")
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    port: 5173
  }
});
