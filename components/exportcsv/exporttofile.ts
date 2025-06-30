//in used
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "@/components/ToastConfig";
import dayjs from "dayjs";
import { getLocale } from "@/components/global";
import { englishLocale } from "@/localization/config";
import { LOCALSTORAGEKEYS, PERMISSIONKEYS } from "@/utils/messages";
import { DATE_FORMAT_PATTERNS } from "@/utils/dateformatter.utils";

// -------------------- Helpers ------------------------

const requestWritableDirectory = async (): Promise<string | null> => {
	const permissions =
		await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
	if (!permissions.granted) {
		showToast({
			type: "error",
			title: PERMISSIONKEYS.PERMISSION_DENIED,
			subtitle: PERMISSIONKEYS.PERMISSION_STORAGE_NOT_GRANTED,
		});
		return null;
	}
	await AsyncStorage.setItem(
		LOCALSTORAGEKEYS.DIRECTORY_URI_KEY,
		permissions.directoryUri
	);
	return permissions.directoryUri;
};

const getOrRequestDirectory = async (): Promise<string | null> => {
	let savedDirectoryUri = await AsyncStorage.getItem(
		LOCALSTORAGEKEYS.DIRECTORY_URI_KEY
	);
	if (savedDirectoryUri) {
		try {
			await FileSystem.StorageAccessFramework.createFileAsync(
				savedDirectoryUri,
				"test.txt",
				"text/plain"
			);
			return savedDirectoryUri;
		} catch {
			console.warn("Saved directory not writable, requesting new one...");
			await AsyncStorage.removeItem(LOCALSTORAGEKEYS.DIRECTORY_URI_KEY);
		}
	}
	return await requestWritableDirectory();
};

const saveToFile = async (
	content: string,
	fileName: string,
	mimeType: string,
	encoding: FileSystem.EncodingType
) => {
	const directoryUri = await getOrRequestDirectory();
	if (!directoryUri) return;

	try {
		const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
			directoryUri,
			fileName,
			mimeType
		);
		await FileSystem.writeAsStringAsync(fileUri, content, { encoding });

		showToast({
			type: "download",
			title: PERMISSIONKEYS.FILE_SAVED,
			subtitle: PERMISSIONKEYS.TAP_TO_OPEN,
			props: {
				fileUri,
				fileName,
				type: mimeType.includes("pdf") ? "pdf" : "csv",
			},
		});
	} catch (error) {
		showToast({
			type: "error",
			title: PERMISSIONKEYS.SAVED_FAILED,
			subtitle: PERMISSIONKEYS.ERROR_ON_SAVING,
		});
	}
};

// ------------------ CSV Utilities ----------------------

const convertPortfolioDealsToCSV = (data: any[]) => {
	const headers = [
		"Date",
		"Time",
		"Derivatives Market",
		"Product / Period",
		"Trade Direction",
		"MW",
		"%",
		"EUR/MWh",
		"CounterParty",
		"Trader",
		"Release",
		"Status",
	];

	const rows = data.map((item) => [
		item.Date,
		item.Time,
		item.DerivativesMarket,
		item.ProductName,
		item.Direction ? "Buy" : "Sell",
		item.Amount,
		item.IsPercentage ? "%" : "",
		item.EuroPerMW,
		item.CounterParty,
		item.Trader,
		item.Release,
		item.State ? "Confirmed" : "Pending",
	]);

	return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

const splitTimeSeriesString = (timeseries: string) => {
	const [datePart, timePart] = timeseries.split(" ");
	const [month, day, year] = datePart.split("/");
	const [hours, minutes] = timePart.split(":");
	const locale = getLocale();
	return {
		formattedDate: dayjs(
			datePart,
			DATE_FORMAT_PATTERNS.DATE_SLASHED_MM_DD_YYY
		).format(
			locale === englishLocale
				? DATE_FORMAT_PATTERNS.DATE_SLASHED_YYYY_MM_DD
				: DATE_FORMAT_PATTERNS.DATE_DOTTED_YYYY_MM_DD
		),
		formattedTime: dayjs(
			`${timePart}:00`,
			DATE_FORMAT_PATTERNS.TIME_PARSE_HH_MM_SS
		).format(DATE_FORMAT_PATTERNS.TIME_PARSE_HH_MM_SS),
	};
};

// ------------------- Export Functions for Android Versions----------------------

const exportBase64ToPDF = async (base64: string, fileName = "document.pdf") => {
	if (!base64) return;
	await saveToFile(
		base64,
		fileName,
		"application/pdf",
		FileSystem.EncodingType.Base64
	);
};

const exportDealsToCSV = async (data: any[], fileName = "trades.csv") => {
	const csvContent = convertPortfolioDealsToCSV(data);
	await saveToFile(
		csvContent,
		fileName,
		"text/csv",
		FileSystem.EncodingType.UTF8
	);
};

const exportTimeseriesToCSV = async (data: any[], fileName = "cockpit.csv") => {
	const headers = ["Date", "Time", "[kwh]"];
	const locale = getLocale();
	const rows = data.map((item) => {
		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x);
		const formattedY = new Intl.NumberFormat(locale, {
			useGrouping: true,
			maximumFractionDigits: 2,
			roundingMode: "floor",
			localeMatcher: "best fit",
			signDisplay: "auto",
			style: "decimal",
		}).format(item.y);

		const safeY = formattedY.includes(",") ? `"${formattedY}"` : formattedY;
		return [`="${formattedDate}"`, formattedTime, safeY].join(",");
	});
	const csvContent = [headers.join(","), ...rows].join("\n");
	await saveToFile(
		csvContent,
		fileName,
		"text/csv",
		FileSystem.EncodingType.UTF8
	);
};

// ------------------Export Functions for Web Versions ------------------------

const downloadBlobWeb = (blob: Blob, fileName: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	link.click();
	URL.revokeObjectURL(url);
};

const exportBase64ToPDFWeb = (base64: string, fileName = "document.pdf") => {
	if (!base64) return;
	const byteCharacters = atob(base64);
	const byteArray = new Uint8Array(
		[...byteCharacters].map((c) => c.charCodeAt(0))
	);
	const blob = new Blob([byteArray], { type: "application/pdf" });
	downloadBlobWeb(blob, fileName);
};

const exportDealsToCSVWeb = (data: any[], fileName = "trades.csv") => {
	const csvContent = convertPortfolioDealsToCSV(data);
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
	downloadBlobWeb(blob, fileName);
};

const exportTimeseriesToCSVForWeb = (data: any[], fileName = "cockpit.csv") => {
	const headers = ["Date", "Time", "[kwh]"];
	const locale = getLocale();
	const rows = data.map((item) => {
		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x);
		const formattedY = new Intl.NumberFormat(locale, {
			useGrouping: true,
			maximumFractionDigits: 2,
			roundingMode: "floor",
			localeMatcher: "best fit",
			signDisplay: "auto",
			style: "decimal",
		}).format(item.y);

		const safeY = formattedY.includes(",") ? `"${formattedY}"` : formattedY;
		return [`="${formattedDate}"`, formattedTime, safeY].join(",");
	});
	const csvContent = [headers.join(","), ...rows].join("\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
	downloadBlobWeb(blob, fileName);
};

// -------------------- Exports ----------------------------

export {
	exportBase64ToPDF,
	exportBase64ToPDFWeb,
	exportDealsToCSV,
	exportDealsToCSVWeb,
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
};
