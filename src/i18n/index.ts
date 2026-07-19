import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["en", "zh"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: Record<SupportedLanguage, string> }[] = [
  { value: "en", label: { en: "English", zh: "英语" } },
  { value: "zh", label: { en: "Chinese", zh: "中文" } },
];

import enCommon from "./locales/en/common.json";
import enLaunch from "./locales/en/launch.json";
import enEditor from "./locales/en/editor.json";
import enSettings from "./locales/en/settings.json";
import enExport from "./locales/en/export.json";
import zhCommon from "./locales/zh/common.json";
import zhLaunch from "./locales/zh/launch.json";
import zhEditor from "./locales/zh/editor.json";
import zhSettings from "./locales/zh/settings.json";
import zhExport from "./locales/zh/export.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: "en",
    fallbackNS: "common",
    ns: ["common", "launch", "editor", "settings", "export"],
    defaultNS: "common",
    resources: {
      en: { common: enCommon, launch: enLaunch, editor: enEditor, settings: enSettings, export: enExport },
      zh: { common: zhCommon, launch: zhLaunch, editor: zhEditor, settings: zhSettings, export: zhExport },
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "clypra-language",
    },
  });

export const changeLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language);
};

export default i18n;
