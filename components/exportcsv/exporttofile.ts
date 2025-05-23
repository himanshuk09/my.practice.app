//in used
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../ToastConfig";

const DIRECTORY_URI_KEY = "SAVED_DIRECTORY_URI";

// -------------------- Helpers ------------------------

const requestWritableDirectory = async (): Promise<string | null> => {
	const permissions =
		await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
	if (!permissions.granted) {
		showToast({
			type: "error",
			title: "Permission_Denied",
			subtitle: "Storage_access_not_granted",
		});
		return null;
	}
	await AsyncStorage.setItem(DIRECTORY_URI_KEY, permissions.directoryUri);
	return permissions.directoryUri;
};

const getOrRequestDirectory = async (): Promise<string | null> => {
	let savedDirectoryUri = await AsyncStorage.getItem(DIRECTORY_URI_KEY);
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
			await AsyncStorage.removeItem(DIRECTORY_URI_KEY);
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
			title: "File_Saved",
			subtitle: "Tap_to_open",
			props: {
				fileUri,
				fileName,
				type: mimeType.includes("pdf") ? "pdf" : "csv",
			},
		});
	} catch (error) {
		showToast({
			type: "error",
			title: "Save_Failed",
			subtitle: "An_error_occurred_while_saving",
		});
	}
};

// ------------------ CSV Utilities ----------------------

const convertDealsToCSV = (data: any[]) => {
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

	return {
		formattedDate: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
		formattedTime: `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`,
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
	const csvContent = convertDealsToCSV(data);
	await saveToFile(
		csvContent,
		fileName,
		"text/csv",
		FileSystem.EncodingType.UTF8
	);
};

const exportTimeseriesToCSV = async (data: any[], fileName = "cockpit.csv") => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = data.map((item) => {
		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x);
		return [formattedDate, formattedTime, item.y].join(",");
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
	const csvContent = convertDealsToCSV(data);
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
	downloadBlobWeb(blob, fileName);
};

const exportTimeseriesToCSVForWeb = (data: any[], fileName = "cockpit.csv") => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = data.map((item) => {
		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x);
		return [formattedDate, formattedTime, item.y].join(",");
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
