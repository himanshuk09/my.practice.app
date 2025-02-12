import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const splitTimestamp = (timestamp: number) => {
    const date = new Date(timestamp); // Convert timestamp to Date object
    const formattedDate = date.toISOString().split("T")[0]; // Extract UTC date (YYYY-MM-DD)
    const formattedTime = date.toISOString().split("T")[1].slice(0, 8);
    [0]; // Extract UTC time (HH:mm:ss)
    return { formattedDate, formattedTime };
};
// for  web
export const saveCSVToFileWeb = (jsonData: any[]) => {
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
export const saveCSVToFile = async (jsonData: any[]) => {
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
const splitTimeStrring = (timestampStr: string) => {
    const [datePart, timePart] = timestampStr.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    return {
        formattedDate: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        formattedTime: `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`,
    };
};

export const saveCSVToFileString0 = async (jsonData: any[]) => {
    const headers = ["Date", "Time", "[kwh]"];
    const rows = jsonData.map((item) => {
        const { formattedDate, formattedTime } = splitTimeStrring(item.x);
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

        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "text/csv"
        );

        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        // Show success toast with "Open" button
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
const DIRECTORY_URI_KEY = "savedDirectoryUri"; // Key for AsyncStorage

export const saveCSVToFileString = async (jsonData: any[]) => {
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
        console.log(savedDirectoryUri);

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
