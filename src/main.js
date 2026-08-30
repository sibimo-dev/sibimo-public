import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";

import App from "@/App.vue";
import router from "@/router";
import { SibimoPreset } from "@/theme/sibimoPreset.js";
import { vReveal } from "@/directives/reveal.js";
import "@/style.css";

const purgeLicenseElements = () => {
    const observer = new MutationObserver(() => {
        const licenseHost = document.getElementById("p-license-host");
        if (licenseHost) {
        licenseHost.remove();
        }

        const chartBanner = document.querySelector(".p-chart-license-banner");
        if (chartBanner) {
        chartBanner.remove();
        }

        const textEditorBanner = document.querySelector(
        ".p-text-editor-license-banner",
        );
        if (textEditorBanner) {
        textEditorBanner.remove();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", purgeLicenseElements);
}
// SETUP NOTE (Stage 0): if the repo already has a main.js from the default
// Vite scaffold, REPLACE its contents with this (don't add/duplicate) —
// make sure the "@/style.css" import stays LAST so Tailwind's @theme isn't
// overridden by PrimeVue's reset.
const app = createApp(App);

app.directive("reveal", vReveal);
app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: SibimoPreset,
    options: {
      darkModeSelector: false, // the public site doesn't use dark mode
    },
  },
});

app.mount("#app");
