export const DATE_FORMAT_PATTERNS = {
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
	PLACEHOLDER: "-- : --",

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
} as const;

export const UNIT_PLACEHOLDER = {
	PLACEHOLDER_EURO: "€",
	PLACEHOLDER_KWH_UNIT: "kWh",
	PLACEHOLDER_MW: "MW",
	PLACEHOLDER_MWH_UNIT: "MWh",
	PLACEHOLDER_EURO_PER_MEGAWATT_HOUR_UNIT: "€/MWh",
} as const;

