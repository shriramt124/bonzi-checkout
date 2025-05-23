import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Add server configuration
  server: {
    // Listen on all addresses
    host: true,

    // Specify allowed hosts that can access your dev server
    allowedHosts: [
      "ad44dbb3-2c11-4d4a-8761-40e90b792d3f-00-pyc7xgw3v7gl.pike.replit.dev",

      // Add more domains as needed
    ],

    // Optional: Set port if needed
    // port: 3000,

    // Optional: Set strictPort if you want Vite to fail if port is already in use
    // strictPort: true,
  },
});
