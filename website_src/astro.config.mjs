// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // security: { csp: true }, // cannot be activated when in development
  base: '/mailcatcher/',
  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [icon()],
});