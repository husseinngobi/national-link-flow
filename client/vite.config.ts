import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: {
    noExternal: true,
  },
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    tsconfigPaths(),
    tailwind(),
  ],
});
