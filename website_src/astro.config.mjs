// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";


import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  // security: { csp: true }, // cannot be activated when in development
  base: '/mailcatcher/',

  integrations: [icon()],

  vite: {
    plugins: [tailwindcss()],
  },
});