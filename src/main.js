import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router/router.js";
import directives from "@/directives";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "./index.scss";

const app = createApp(App);
const pinia = createPinia();

directives.forEach((directive) => {
  app.directive(directive.name, directive);
});

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: true,
        cssLayer: {
          name: "primevue",
          order: "reset, primevue",
        },
        darkModeSelector: "system",
      },
    },
  })
  .mount("#app");
