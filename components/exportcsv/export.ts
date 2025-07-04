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
// for  web timestamp
const saveCSVToFileWeb = (jsonData: any[]) => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = jsonData.map((item) => {
		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x); // Split timestamp
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
		const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
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
		const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
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

// .....................//

// base64 to pdf for portfolio screen
const exportBase64ToPDF = async (base64: string, fileName = "document.pdf") => {
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
		const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
			savedDirectoryUri,
			fileName,
			"application/pdf"
		);

		// Write the Base64 data to the file
		await FileSystem.writeAsStringAsync(fileUri, base64, {
			encoding: FileSystem.EncodingType.Base64,
		});
		console.log(fileUri, fileName);

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
const exportBase64ToPDFWeb = (base64: string, fileName = "document.pdf") => {
	try {
		if (!base64) return;

		// Convert Base64 to a byte array
		const byteCharacters = atob(base64);
		const byteNumbers = new Uint8Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}

		// Create a Blob object
		const pdfBlob = new Blob([byteNumbers], { type: "application/pdf" });

		// Create a URL for the Blob
		const blobUrl = URL.createObjectURL(pdfBlob);

		// Open the file in a new tab (ensures the browser downloads it)
		window.open(blobUrl, "_blank");

		// Create a download link
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = fileName;

		// Append link to body, trigger download, then clean up
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Release object URL after a short delay
		setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
	} catch (error) {
		console.error("Error saving PDF:", error);
	}
};
// deals list to csv
const convertDealsToCSV = (data: any) => {
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

	const rows = data.map((item: any) => [
		item.Date, // Date
		item.Time, // Time
		item.DerivativesMarket, // Derivatives Market
		item.ProductName, // Product / Period
		item.Direction ? "Buy" : "Sell", // Trade Direction
		item.Amount, // MW
		item.IsPercentage ? "%" : "", // Percentage
		item.EuroPerMW, // EUR/MWh
		item.CounterParty, // CounterParty
		item.Trader, // Trader
		item.Release, // Release
		item.State ? "Confirmed" : "Pending", // Status
	]);

	return [headers.join(","), ...rows.map((row: any) => row.join(","))].join(
		"\n"
	);
};

const exportDealsToCSV = async (data: any, fileName = "trades.csv") => {
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

		const csvContent = convertDealsToCSV(data);

		// Create the file in the chosen directory
		const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
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

const exportDealsToCSVWeb = async (data: any, fileName = "trades.csv") => {
	try {
		const csvContent = convertDealsToCSV(data);
		const blob = new Blob([csvContent], { type: "text/csv" });

		// Create a URL for the Blob
		const url = URL.createObjectURL(blob);

		// Open in a new tab (forces browser to recognize download)
		window.open(url, "_blank");

		// Create an anchor element for downloading
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;

		// Append, trigger download, and clean up
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// Delay revoking the URL to ensure file download is registered
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	} catch (error) {
		console.error("Error saving CSV:", error);
	}
};

//new function after added load data api to convert timeseries to csv
const splitTimeSeriesString = (timeseries: string) => {
	// Input format: "mm/dd/yyyy hh:mm"
	const [datePart, timePart] = timeseries.split(" ");
	const [month, day, year] = datePart.split("/"); // Changed order to match input format
	const [hours, minutes] = timePart.split(":");

	return {
		formattedDate: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`, // yyyy-mm-dd
		formattedTime: `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`, // hh:mm:ss
	};
};

const exportTimeseriesToCSV = async (data: any[]) => {
	const headers = ["Date", "Time", "[kwh]"];

	const rows = data.map((item) => {
		if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(item.x)) {
			console.warn(`Unexpected date format: ${item.x}`);
		}

		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x);
		return [formattedDate, formattedTime, item.y].join(",");
	});
	console.log("rows", rows[0]);
	const csvContent = [headers.join(","), ...rows].join("\n");
	const fileName = "cockpit.csv";

	const saveToFolder = async (directoryUri: string) => {
		const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
			directoryUri,
			fileName,
			"text/csv"
		);
		await FileSystem.writeAsStringAsync(fileUri, csvContent, {
			encoding: FileSystem.EncodingType.UTF8,
		});

		Toast.show({
			type: "download",
			text1: "File Saved",
			text2: "Tap to open the file.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 5000,
			props: { fileUri, fileName, type: "csv" },
		});
	};

	try {
		let savedDirectoryUri = await AsyncStorage.getItem(DIRECTORY_URI_KEY);

		// Attempt to save using saved directory
		if (savedDirectoryUri) {
			try {
				await saveToFolder(savedDirectoryUri);
				return;
			} catch (error: any) {
				console.warn(
					"Saved directory not writable. Requesting new folder."
				);
			}
		}

		// Ask for new folder
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
		await AsyncStorage.setItem(DIRECTORY_URI_KEY, savedDirectoryUri);

		// Save using new directory
		await saveToFolder(savedDirectoryUri);
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

const exportTimeseriesToCSVForWeb = (data: any[]) => {
	const headers = ["Date", "Time", "[kwh]"];
	const rows = data.map((item) => {
		const { formattedDate, formattedTime } = splitTimeSeriesString(item.x); // Split timestamp
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
export {
	saveCSVToFileWeb,
	saveCSVToFile,
	saveCSVToFileString,
	exportBase64ToPDF,
	exportBase64ToPDFWeb,
	exportDealsToCSV,
	exportDealsToCSVWeb,
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
};
