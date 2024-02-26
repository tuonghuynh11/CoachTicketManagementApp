import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import vi from "../locales/vi.json";

const languagesResources = {
  en: { translation: en },
  vi: { translation: vi },
};
i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  resources: languagesResources,
});
export default i18next;
