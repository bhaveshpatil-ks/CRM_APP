import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@react-native-async-storage/async-storage": path.resolve(__dirname, "src/asyncStorageMock.js")
    }
  },
  server: {
    port: 5173
  }
});
