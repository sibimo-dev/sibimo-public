import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

/**
 * SIBIMO Public color palette — follows sibimo-fullpage-preview.html
 * (navbar design reference): blue as primary, gold as accent.
 *
 * TODO before final: align with sibimo-admin's color tokens once its
 * official brand guide is available (the SibimoPreset used there).
 */
export const SibimoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#eaf6fd",
      100: "#cdebfa",
      200: "#9ad9f5",
      300: "#5fc4ee",
      400: "#2fa6de",
      500: "#1483c7",
      600: "#136aa3",
      700: "#175380", // main button, active link
      800: "#1c3f61",
      900: "#22314f",
      950: "#141f33",
    },
  },
});

/**
 * Extra tokens for use via CSS vars / Tailwind utilities outside PrimeVue
 * components — defined & mapped to @theme in src/style.css.
 * Don't hardcode new hex values in components, add them here + style.css
 * if a new token is needed.
 */
export const brandTokens = {
  bg: "#f6f8f9",
  surface: "#ffffff",
  surfaceHover: "#f6f8f9",
  surfaceActive: "#eaf6fd",
  border: "#e2e6e8",
  text: "#434c4f",
  textMuted: "#707d81",
  textHeading: "#212525",
  primary: "#175380",
  primaryHover: "#1c3f61",
  secondary: "#c9a227",
};
