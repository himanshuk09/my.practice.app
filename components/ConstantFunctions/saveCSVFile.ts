import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform, ToastAndroid } from "react-native";
import { StorageAccessFramework } from "expo-file-system";

const splitTimestamp = (timestamp: number) => {
    const date = new Date(timestamp); // Convert timestamp to Date object
    const formattedDate = date.toISOString().split("T")[0]; // Extract UTC date (YYYY-MM-DD)
    const formattedTime = date.toISOString().split("T")[1].slice(0, 8);
    [0]; // Extract UTC time (HH:mm:ss)
    return { formattedDate, formattedTime };
};

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
export const saveCSVToFileMain = async (jsonData: any[]) => {
    const headers = ["Date", "Time", "[kwh]"];
    const rows = jsonData.map((item) => {
        const { formattedDate, formattedTime } = splitTimestamp(item.x); // Split timestamp
        return [formattedDate, formattedTime, item.y].join(","); // Combine into CSV row
    });
    // Combine headers and rows to form the final CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");
    const fileName = `${FileSystem.documentDirectory}cockpit.csv`;
    try {
        // Write CSV content to file
        await FileSystem.writeAsStringAsync(fileName, csvContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });
        console.log(`CSV file saved at: ${fileName}`);
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileName);
        }
    } catch (error) {
        console.error("Error saving CSV file:", error);
    }
};

export const saveCSVToFile = async (jsonData: any[]) => {
    const headers = ["Date", "Time", "[kwh]"];
    const rows = jsonData.map((item) => {
        const { formattedDate, formattedTime } = splitTimestamp(item.x); // Split timestamp
        return [formattedDate, formattedTime, item.y].join(","); // Combine into CSV row
    });
    // Combine headers and rows to form the final CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");
    const fileName = "cockpit.csv";

    try {
        // Request storage permissions
        const permissions =
            await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
            console.log("Permissions not granted!");
            return;
        }

        // Create the file in the selected directory
        const uri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "application/csv"
        );

        // Write the CSV content as a string to the created file
        await FileSystem.writeAsStringAsync(uri, csvContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        ToastAndroid.show("CSV file saved successfully!", ToastAndroid.SHORT);
    } catch (error) {
        console.log("Error saving CSV file:", error);
        ToastAndroid.show("Error saving CSV file", ToastAndroid.LONG);
    }
};
