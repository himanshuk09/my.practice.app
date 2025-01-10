import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
const splitTimestamp = (timestamp: number) => {
  const date = new Date(timestamp); // Convert timestamp to Date object
  const formattedDate = date.toISOString().split("T")[0]; // Extract UTC date (YYYY-MM-DD)
  const formattedTime = date.toISOString().split("T")[1].slice(0, 8);
  [0]; // Extract UTC time (HH:mm:ss)
  return { formattedDate, formattedTime };
};
// Function to save CSV to a file
export const saveCSVToFile = async (jsonData: any[]) => {
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
