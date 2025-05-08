// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image'],
  ui: {
    global: true,
    icons: ['heroicons'],
  },
  app: {
    head: {
      title: 'Cybernetics Core',
      meta: [{ name: 'description', content: 'Admin panel for Cybernetics Core' }],
    },
  },
});
