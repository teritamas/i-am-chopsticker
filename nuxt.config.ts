// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  nitro: {
    preset: "firebase",
    firebase: {
      gen: 2,
    },
  },
});
