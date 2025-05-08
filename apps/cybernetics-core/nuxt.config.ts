import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image'],
  app: {
    head: {
      title: 'Cybernetics Core',
      meta: [{ name: 'description', content: 'Admin panel for Cybernetics Core' }],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'vercel',
    output: {
      dir: '.vercel/output',
    },
  },
});
