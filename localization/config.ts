import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { TranslationKeys } from "@/localization/languagekey";

const supportedLocales = ["en", "de"]; // English and German

const englishIN = "en-IN";
const germany = "de-DE";
const englishUS = "en-US";
const englishLocale = "en";
const germanyLocale = "de";

const i18n: any = new I18n(TranslationKeys); // assign  keys

const locales = Localization.getLocales(); // get devices support languages

const deviceLang: any = locales?.[0]?.languageCode; // get the devices default language

const deviceLocale = supportedLocales.includes(deviceLang) ? deviceLang : "en"; // fallback to English

i18n.locale = deviceLocale;

i18n.enableFallback = true;

export { i18n, englishIN, englishUS, englishLocale, germany, germanyLocale };
