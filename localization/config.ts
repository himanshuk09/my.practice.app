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

const DATE_FORMAT_PATTERNS = {
	// Full date and time formats
	DATE_TIME_FULL_DASHED: "DD-MM-YYYY-HH-mm-ss",
	DATE_TIME_SLASHED_DD_MM_YYYY_HH_MM: "DD/MM/YYYY HH:mm",
	DATE_TIME_DOTTED_DD_MM_YYYY_HH_MM: "DD.MM.YYYY HH:mm",

	// Date only formats
	DATE_SLASHED_DD_MM_YYYY: "DD/MM/YYYY",
	DATE_DOTTED_DD_MM_YYYY: "DD.MM.YYYY",
	DATE_MONTH_NAME_MMM_DD_YYYY: "MMM, DD, YYYY",

	// Placeholder formats (for UI)
	DATE_PLACEHOLDER_SLASHED: "-- / -- /----",
	DATE_PLACEHOLDER_DOTTED: "-- . -- . ----",

	// Parsing and conversion formats
	DATE_SLASHED_MM_DD_YYY: "MM/DD/YYYY",
	DATE_SLASHED_YYYY_MM_DD: "YYYY/MM/DD",
	DATE_DOTTED_YYYY_MM_DD: "YYYY.MM.DD",

	// Time formats
	TIME_PARSE_HH_MM_SS: "HH:mm:ss",
	TIME_PARSE_HH_MM: "HH:mm",
	// Number formats
	DECIMAL_DOT: "00.00",
	DECIMAL_COMMA: "00,00",
};

export {
	i18n,
	englishIN,
	englishUS,
	englishLocale,
	germany,
	germanyLocale,
	DATE_FORMAT_PATTERNS,
};
