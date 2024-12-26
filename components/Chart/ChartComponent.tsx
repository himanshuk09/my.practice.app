import {
  View,
  Text,
  Platform,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { htmlContent, iframehtmlcontent } from "./charthtmlcontent";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
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
  const handleMessagePNG = async (event: any) => {
    const base64Data = event.nativeEvent.data; // Base64 string of chart

    if (base64Data === "Chart loaded") {
      console.log("Chart successfully loaded inside WebView");
      return; // Handle chart loading message
    }
    console.log("base64Data", base64Data);

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

  return (
    <>
      {Platform.OS !== "web" ? (
        <>
          {/* <Button
            title="reload Chart"
            onPress={() => webViewRef?.current?.reload()}
          />
          <Button
            title="Export Chart"
            onPress={() =>
              webViewRef?.current.injectJavaScript("exportChart();")
            }
          /> */}
          <WebView
            key={refereshkey}
            className="z-20"
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            onLoadStart={() => console.log("WebView start Load")}
            onLoad={() => console.log("WebView Loaded")}
            onLoadEnd={() => console.log("WebView end Load")}
            onMessage={onMessage}
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
            onFileDownload={({ nativeEvent }: any) => {
              const { downloadUrl } = nativeEvent;
              console.log("DownloadUrl", downloadUrl);
            }}
            scalesPageToFit={false}
            allowsInlineMediaPlayback
            // startInLoadingState
            onHttpError={(syntheticEvent) => {
              const { statusCode } = syntheticEvent.nativeEvent;
              console.log("HTTP error status code", statusCode);
            }}
            injectedJavaScript={`document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=3.0, user-scalable=yes');`}
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
