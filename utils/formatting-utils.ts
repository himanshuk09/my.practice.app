import dayjs from "dayjs";
import { germanyLocale } from "@/localization/config";

export const formatNumber = (value: number, locale: string): string => {
	return new Intl.NumberFormat(locale, {
		useGrouping: false,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
};

export const parseNumber = (
	value: string | number | null | undefined | any,
	locale: string
): number => {
	if (value === null || value === undefined || value === 0) {
		return 0;
	}
	const normalized =
		locale === germanyLocale
			? value?.replace(/\./g, "").replace(",", ".")
			: value;
	return parseFloat(normalized);
};

//convert mm/dd/yyy  hh:mm to string
export const convertDateTime = (input: string) => {
	const [datePart, timePart] = input.split(" "); // ["05/28/2025", "00:00"]
	const [month, day, year] = datePart.split("/"); // ["05", "28", "2025"]

	const isoString = `${year}-${month}-${day}T${timePart}`; // "2025-05-28T00:00"
	const originalDate = new Date(isoString);

	return dayjs(originalDate);
};

// formate to dd■mm■$yy■hh■mm
export function formatDateTime(input: any) {
	const date = new Date(input);
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${day}■${month}■${year}■${hours}■${minutes}`;
}
