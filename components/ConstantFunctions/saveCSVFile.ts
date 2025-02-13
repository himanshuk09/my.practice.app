import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
const DIRECTORY_URI_KEY = "savedDirectoryUri"; // Key for AsyncStorage
const splitTimestamp = (timestamp: number) => {
	const date = new Date(timestamp); // Convert timestamp to Date object
	const formattedDate = date.toISOString().split("T")[0]; // Extract UTC date (YYYY-MM-DD)
	const formattedTime = date.toISOString().split("T")[1].slice(0, 8);
	[0]; // Extract UTC time (HH:mm:ss)
	return { formattedDate, formattedTime };
};
const splitTimeStrring = (timestampStr: string) => {
	const [datePart, timePart] = timestampStr.split(" ");
	const [day, month, year] = datePart.split("/");
	const [hours, minutes] = timePart.split(":");

	return {
		formattedDate: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
		formattedTime: `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`,
	};
};
// for  web
const saveCSVToFileWeb = (jsonData: any[]) => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = jsonData.map((item) => {
		const { formattedDate, formattedTime } = splitTimestamp(item.x); // Split timestamp
		return [formattedDate, formattedTime, item.y].join(","); // Combine into CSV row
	});

	const csvContent = [headers.join(","), ...rows].join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = "cockpit.csv";
	link.click();
	URL.revokeObjectURL(url);
};
//......for timestamp
const saveCSVToFile = async (jsonData: any[]) => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = jsonData.map((item) => {
		const { formattedDate, formattedTime } = splitTimestamp(item.x);
		return [formattedDate, formattedTime, item.y].join(",");
	});
	const csvContent = [headers.join(","), ...rows].join("\n");
	const fileName = "cockpit.csv";

	try {
		const permissions =
			await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
		if (!permissions.granted) {
			Toast.show({
				type: "download",
				text1: "Permission Denied",
				text2: "Storage access not granted!",
				position: "bottom",
				bottomOffset: 0,
				visibilityTime: 5000,
			});
			return;
		}

		// Create the file
		const fileUri =
			await FileSystem.StorageAccessFramework.createFileAsync(
				permissions.directoryUri,
				fileName,
				"text/csv" // Use text/csv instead of application/csv
			);

		// Write the file
		await FileSystem.writeAsStringAsync(fileUri, csvContent, {
			encoding: FileSystem.EncodingType.UTF8,
		});

		// Show success toast with "Open" and "Share" button
		Toast.show({
			type: "download",
			text1: "File has been saved!",
			text2: "Tap to open the file.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
			props: { fileUri: fileUri, fileName: fileName, type: "csv" },
		});
	} catch (error) {
		Toast.show({
			type: "download",
			text1: "Failed to save file",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 3000,
		});
	}
};
//.........for string
//one time permission
const saveCSVToFileString = async (jsonData: any[]) => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = jsonData.map((item) => {
		const { formattedDate, formattedTime } = splitTimeStrring(item.x);
		return [formattedDate, formattedTime, item.y].join(",");
	});

	const csvContent = [headers.join(","), ...rows].join("\n");
	const fileName = "cockpit.csv";

	try {
		// Retrieve saved directory URI from AsyncStorage
		let savedDirectoryUri = await AsyncStorage.getItem(DIRECTORY_URI_KEY);
		// If no saved directory, ask for permission
		if (!savedDirectoryUri) {
			const permissions =
				await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
			if (!permissions.granted) {
				Toast.show({
					type: "download",
					text1: "Permission Denied",
					text2: "Storage access not granted!",
					position: "bottom",
					bottomOffset: 0,
					visibilityTime: 5000,
				});
				return;
			}
			savedDirectoryUri = permissions.directoryUri;
			await AsyncStorage.setItem(DIRECTORY_URI_KEY, savedDirectoryUri); // Store for future use
		}

		// Create the file
		const fileUri =
			await FileSystem.StorageAccessFramework.createFileAsync(
				savedDirectoryUri,
				fileName,
				"text/csv"
			);

		// Write the file
		await FileSystem.writeAsStringAsync(fileUri, csvContent, {
			encoding: FileSystem.EncodingType.UTF8,
		});

		// Show success toast
		Toast.show({
			type: "download",
			text1: "File Saved",
			text2: "Tap to open the file.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
			props: { fileUri, fileName, type: "csv" },
		});
	} catch (error) {
		console.error("Error:", error);
		Toast.show({
			type: "download",
			text1: "Failed to Save File",
			text2: "An error occurred while saving.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
		});
	}
};
// base64 to pdf
const shareBase64AsPDF = async (base64: string, fileName = "document.pdf") => {
	try {
		if (base64 === "") {
			return;
		}
		let savedDirectoryUri = await AsyncStorage.getItem(DIRECTORY_URI_KEY);

		if (!savedDirectoryUri) {
			const permissions =
				await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
			if (!permissions.granted) {
				Toast.show({
					type: "error",
					text1: "Permission Denied",
					text2: "Storage access not granted!",
					position: "bottom",
					bottomOffset: 0,
					visibilityTime: 3000,
				});
				return;
			}
			savedDirectoryUri = permissions.directoryUri;
			await AsyncStorage.setItem(DIRECTORY_URI_KEY, savedDirectoryUri); // Store for future use
		}

		// Create the file
		const fileUri =
			await FileSystem.StorageAccessFramework.createFileAsync(
				savedDirectoryUri,
				fileName,
				"application/pdf"
			);

		// Write the Base64 data to the file
		await FileSystem.writeAsStringAsync(fileUri, base64, {
			encoding: FileSystem.EncodingType.Base64,
		});

		// Show success toast
		Toast.show({
			type: "download",
			text1: "PDF Saved",
			text2: "Tap to open the file.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
			props: { fileUri: fileUri, fileName: fileUri, type: "pdf" },
		});
	} catch (error) {
		console.error("Error sharing PDF:", error);
		Toast.show({
			type: "error",
			text1: "Failed to Save PDF",
			text2: "An error occurred while saving.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
		});
	}
};
const saveBase64AsPDFWeb = (base64: string, fileName = "document.pdf") => {
	try {
		if (base64 === "") {
			return;
		}
		// Convert Base64 to a Blob
		const byteCharacters = atob(base64);
		const byteNumbers = new Uint8Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const pdfBlob = new Blob([byteNumbers], { type: "application/pdf" });

		// Create a download link
		const link = document.createElement("a");
		link.href = URL.createObjectURL(pdfBlob);
		link.download = fileName;

		// Trigger the download
		document.body.appendChild(link);
		link.click();

		// Cleanup
		document.body.removeChild(link);
		URL.revokeObjectURL(link.href);
	} catch (error) {
		console.error("Error saving PDF:", error);
	}
};

const convertDealsToCSV = (data: any) => {
	const headers = [
		"PortfolioId",
		"ProductName",
		"Direction",
		"Amount",
		"Price",
		"Trader",
		"Date",
		"State",
		"DerivativesMarket",
		"IsPercentage",
		"CounterParty",
		"Release",
		"EuroPerMW",
		"Time",
		"ShortCounterPartyName",
	];

	const rows = data.map((item: any) => [
		item.PortfolioId,
		item.ProductName,
		item.Direction ? "Buy" : "Sell",
		item.Amount,
		item.Price,
		item.Trader,
		item.Date,
		item.State ? "Confirmed" : "Pending",
		item.DerivativesMarket,
		item.IsPercentage,
		item.CounterParty,
		item.Release,
		item.EuroPerMW,
		item.Time,
		item.ShortCounterPartyName,
	]);

	return [headers.join(","), ...rows.map((row: any) => row.join(","))].join(
		"\n"
	);
};

const saveDealseCSV = async (jsonData: any, fileName = "trades.csv") => {
	try {
		let savedDirectoryUri = await AsyncStorage.getItem(DIRECTORY_URI_KEY);

		if (!savedDirectoryUri) {
			const permissions =
				await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
			if (!permissions.granted) {
				alert("Permission denied! Storage access not granted.");
				return;
			}
			savedDirectoryUri = permissions.directoryUri;
			await AsyncStorage.setItem(DIRECTORY_URI_KEY, savedDirectoryUri);
		}

		const csvContent = convertDealsToCSV(jsonData);

		// Create the file in the chosen directory
		const fileUri =
			await FileSystem.StorageAccessFramework.createFileAsync(
				savedDirectoryUri,
				fileName,
				"text/csv"
			);

		// Write CSV content to the file
		await FileSystem.writeAsStringAsync(fileUri, csvContent, {
			encoding: FileSystem.EncodingType.UTF8,
		});

		Toast.show({
			type: "download",
			text1: "PDF Saved",
			text2: "Tap to open the file.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
			props: { fileUri: fileUri, fileName: fileUri, type: "pdf" },
		});
	} catch (error) {
		Toast.show({
			type: "error",
			text1: "Failed to Save PDF",
			text2: "An error occurred while saving.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
		});
	}
};

export {
	saveCSVToFileWeb,
	saveCSVToFile,
	saveCSVToFileString,
	shareBase64AsPDF,
	saveBase64AsPDFWeb,
	saveDealseCSV,
};
