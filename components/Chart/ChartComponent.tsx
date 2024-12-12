import { View, Text, Platform } from "react-native";
import React, { useRef, useState } from "react";
import WebView from "react-native-webview";
import { htmlContent, iframehtmlcontent } from "./charthtmlcontent";
type ChartComponentProps = {
  webViewRef?: React.RefObject<any>;
  iFrameRef?: React.RefObject<any>;
  onMessage?: (event: any) => void;
};
const ChartComponent: React.FC<ChartComponentProps> = ({
  webViewRef,
  iFrameRef,
  onMessage,
}) => {
  const handleWebViewMessage = (event: any) => {
    console.log("webview");
  };

  return (
    <>
      {Platform.OS !== "web" ? (
        <WebView
          className="z-20"
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          onLoad={handleWebViewMessage}
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
        />
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
