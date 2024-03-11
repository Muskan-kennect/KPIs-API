import vuetify from "vite-plugin-vuetify";
export default defineNuxtConfig({
  devtools: { enabled: true} ,
  css:["vuetify/styles/main.sass"],
  build:{
    transpile:["vuetify"],
  }, 
  imports:['composables/**',],
  modules: ["@pinia/nuxt"],
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins?.push(vuetify());
    },
  },
  

    
})
