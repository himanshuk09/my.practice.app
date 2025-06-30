import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { TranslationKeys } from "@/localization/languagekey";

// Supported locales
const supportedLocales = ["en", "de"] as const;
type SupportedLocale = (typeof supportedLocales)[number]; // "en" | "de"

// Regional variants
const englishIN = "en-IN";
const englishUS = "en-US";
const englishLocale: SupportedLocale = "en";
const germany = "de-DE";
const germanyLocale: SupportedLocale = "de";

// Initialize i18n instance
const i18n = new I18n(TranslationKeys);

// Get device locales (ordered by priority)
const locales = Localization.getLocales();

// Extract device language (e.g., "en", "de", "fr", etc.)
const deviceLang = locales?.[0]?.languageCode;

// Validate and assign locale
const deviceLocale: SupportedLocale = supportedLocales.includes(
	deviceLang as SupportedLocale
)
	? (deviceLang as SupportedLocale)
	: "en"; // fallback

i18n.locale = deviceLocale;
i18n.enableFallback = true;



export {
	i18n,
	englishIN,
	englishUS,
	englishLocale,
	germany,
	germanyLocale,
	
};
