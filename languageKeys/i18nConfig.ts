import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { TranslationKeys } from "@/languageKeys/languagekey";

// Define your supported locales
const englishIN = "en-IN";
const germany = "de-DE";
const englishUS = "en-US";

// Initialize i18n with your translation keys
const i18n: any = new I18n(TranslationKeys);

// Get the device locale (or fall back to 'en-US' if not available)
const deviceLocale = Localization.getLocales()[0]?.languageCode || englishUS;
i18n.locale = deviceLocale;

// Enable fallback for missing translations
i18n.enableFallback = true;

// Optionally log the current locale for debugging purposes
console.log("Current Locale:", i18n.locale);

export { i18n, englishIN, germany, englishUS };

// import { I18n } from "i18n-js";
// import * as Localization from "expo-localization";
// import { TranslationKeys } from "@/languageKeys/languagekey";

// const englishIN = "en-IN";
// const germany = "de-DE";
// const englishUS = "en-US";

// const i18n: any = new I18n(TranslationKeys);
// i18n.locale = Localization.getLocales()[0].languageCode;
// i18n.enableFallback = true;

// export { i18n, englishIN, germany, englishUS };
