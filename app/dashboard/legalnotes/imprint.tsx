import React, { useRef } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
export default function CaptureAndShareScreen() {
  const viewRef = useRef(null);
  const shartFile = async (uri: any) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Sharing is not available on this platform.");
    }
  };
  const saveFileInunknownLocation = async (uri: any) => {
    try {
      const fileName = "CapturedImage.png"; // Your desired filename
      const fileUri =
        Platform.OS === "android"
          ? `${FileSystem.documentDirectory}${fileName}`
          : `${FileSystem.cacheDirectory}${fileName}`;

      // Copy the file to the desired location
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });
      console.log("File saved to:", fileUri);
      if (Platform.OS === "android") {
        Alert.alert("Success", `File saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };
  const saveToDownloads = async (uri: any) => {
    try {
      const fileName = "CapturedImage.png"; // Your desired filename

      // On Android, use StorageAccessFramework to access Downloads folder
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const downloadUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              fileName,
              "image/png" // File type
            );

          // Read the file as binary data and write it to the Downloads folder
          const fileData = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await FileSystem.writeAsStringAsync(downloadUri, fileData, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert("Success", "File saved to Downloads folder.");
          console.log("File saved at:", downloadUri);
        } else {
          Alert.alert("Permission denied", "Cannot access Downloads folder.");
        }
      } else {
        Alert.alert(
          "Platform not supported",
          "This functionality is only for Android."
        );
      }
    } catch (error) {
      console.error("Error saving file to Downloads folder:", error);
      Alert.alert("Error", "Failed to save the file.");
    }
  };
  // Function to save the PDF in Downloads folder
  const saveToDownloadsPDF = async (pdfUri: any) => {
    try {
      const fileName = "CapturedBlock.pdf"; // Desired file name

      // On Android, use StorageAccessFramework to access Downloads folder
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const downloadUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              fileName,
              "application/pdf" // File type
            );

          // Read the PDF file as binary and write it to the Downloads folder
          const fileData = await FileSystem.readAsStringAsync(pdfUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await FileSystem.writeAsStringAsync(downloadUri, fileData, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert("Success", "PDF saved to Downloads folder.");
          console.log("PDF saved at:", downloadUri);
        } else {
          Alert.alert("Permission denied", "Cannot access Downloads folder.");
        }
      } else {
        Alert.alert(
          "Platform not supported",
          "This functionality is only for Android."
        );
      }
    } catch (error) {
      console.error("Error saving PDF to Downloads folder:", error);
      Alert.alert("Error", "Failed to save the PDF.");
    }
  };

  // Function to capture and save the block
  const handleCaptureAndSave = async () => {
    try {
      if (!viewRef.current) {
        Alert.alert("Error", "Unable to capture the block.");
        return;
      }

      const uri = await captureRef(viewRef.current, {
        format: "png",
        quality: 0.8,
      });
      console.log("Captured Image URI:", uri);

      // await saveToDownloads(uri);
      // Convert the image to a base64 string
      const base64Image = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create HTML content for the PDF
      const htmlContent = `
        <html>
          <body style="text-align: center;">
            <h2>Captured Block</h2>
            <img src="data:image/png;base64,${base64Image}" style="width: 100%; max-width: 500px;" />
          </body>
        </html>
      `;

      // Generate the PDF
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log("Generated PDF URI:", pdfUri);
      await saveToDownloadsPDF(uri);
    } catch (error) {
      console.error("Error capturing or saving:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture and Share Block</Text>

      {/* Block to capture */}
      <View ref={viewRef} style={styles.captureBlock}>
        <Text>This is the area to capture and share!</Text>
      </View>

      <Button title="Capture & Share" onPress={handleCaptureAndSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  captureBlock: {
    width: 200,
    height: 150,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 8,
  },
});

// import React, { useEffect } from "react";
// import { View, Text, Image } from "react-native";
// import { parse } from "json2csv";
// import { i18n } from "@/languageKeys/i18nConfig";
// import { useDispatch } from "react-redux";
// import { inActiveLoading } from "@/store/navigationSlice";
// import { useIsFocused } from "@react-navigation/native";
// const Imprint = () => {
//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();
//   useEffect(() => {
//     setTimeout(() => dispatch(inActiveLoading()), 100);
//   }, [isFocused]);

//   return (
//     <View className="flex-1 justify-center items-center bg-gray-100">
//       {/* <ComingSoon /> */}

//       <Text className="text-4xl font-bold text-gray-700 mb-4">
//         {i18n.t("comingsoon")}
//       </Text>
//       <Text className="text-lg text-center  text-gray-500">
//         {i18n.t("We_re_working_hard_to_bring_you_something_amazing")}
//       </Text>
//     </View>
//   );
// };

// export default Imprint;
