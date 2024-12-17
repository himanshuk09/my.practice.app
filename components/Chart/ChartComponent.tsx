import { View, Text, Platform, Button, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { htmlContent, iframehtmlcontent } from "./charthtmlcontent";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
type ChartComponentProps = {
  webViewRef?: React.RefObject<any>;
  iFrameRef?: React.RefObject<any>;
  onMessage?: (event: any) => void;
  id?: number;
  refereshkey?: number;
};
const ChartComponent: React.FC<ChartComponentProps> = ({
  webViewRef,
  iFrameRef,
  onMessage,
  id,
  refereshkey,
}) => {
  const handleWebViewMessage = (event: any) => {
    console.log("webview");
    console.log("WebView Loaded");
  };
  const [keys, setKey] = useState<any>(1);
  const reloadWebView = () => {
    setKey((prevKey: any) => prevKey + 1);
  };
  const handleMessagePnG1 = async (event: any) => {
    const base64Data = event.nativeEvent.data; // Base64 string of chart
    const fileName = `${FileSystem.documentDirectory}chart.png`;

    // Save Base64 as a file
    await FileSystem.writeAsStringAsync(fileName, base64Data.split(",")[1], {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share or Save the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileName);
    }
  };
  const handleMessagePnG = async (event: any) => {
    const base64Data = event.nativeEvent.data; // Base64 string of chart

    if (base64Data === "Chart loaded") {
      console.log("Chart successfully loaded inside WebView");
      return; // Handle chart loading message
    }

    if (base64Data && base64Data.startsWith("data:image/png;base64,")) {
      const fileName = `${FileSystem.documentDirectory}chart.png`;

      try {
        // Save Base64 as a file
        await FileSystem.writeAsStringAsync(
          fileName,
          base64Data.split(",")[1],
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        // Share or Save the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileName);
        }
      } catch (error) {
        console.error("Error saving chart image:", error);
      }
    } else {
      console.log("Received unexpected message:", base64Data);
    }
  };

  const saveCSVToFile = async (csvContent: any) => {
    try {
      const fileName = "apexchart-data.csv";
      const fileUri = FileSystem.documentDirectory + fileName;

      // Save CSV content
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert("Success", `CSV file saved to: ${fileUri}`);
      console.log("File saved to:", fileUri);
    } catch (error) {
      console.error("Error saving CSV file:", error);
      Alert.alert("Error", "Failed to save CSV file.");
    }
  };

  // Handle CSV data sent from the WebView
  const handleMessageCSV = (event: any) => {
    const csvContent = event.nativeEvent.data;
    console.log("CSV Content Received:", csvContent);
    saveCSVToFile(csvContent);
  };

  return (
    <>
      {Platform.OS !== "web" ? (
        <>
          <Button
            title="reload Chart"
            onPress={() => webViewRef?.current?.reload()}
          />
          {/* <Button
            title="Export Chart"
            onPress={() =>
              webViewRef?.current.injectJavaScript("exportChart();")
            }
          /> */}
          <Button
            title="Trigger CSV Download"
            onPress={() => {
              if (webViewRef?.current) {
                webViewRef.current.injectJavaScript(
                  "window.captureCSVDownload();"
                );
              }
            }}
          />
          <WebView
            key={refereshkey}
            className="z-20"
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            onLoad={handleWebViewMessage}
            onLoadEnd={() => console.log("WebView Fully Loaded")}
            // onMessage={onMessage}
            onMessage={handleMessagePnG}
            injectedJavaScriptBeforeContentLoaded={htmlContent}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            useWebkit={true}
            allowsFullscreenVideo={true}
            overScrollMode="never"
            gestureHandling="auto"
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={false}
            setWebContentsDebuggingEnabled={true}
            containerStyle={{
              overflow: "hidden",
            }}
          />
        </>
      ) : (
        <iframe
          ref={iFrameRef}
          srcDoc={iframehtmlcontent}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            overflow: "hidden",
            pointerEvents: "auto",
            margin: 1,
          }}
        />
      )}
    </>
  );
};

export default ChartComponent;
