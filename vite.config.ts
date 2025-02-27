import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import version from "vite-plugin-package-version";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss(), version()],
});
