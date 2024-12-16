import { View, Text, Platform, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { htmlContent, iframehtmlcontent } from "./charthtmlcontent";
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
  return (
    <>
      {Platform.OS !== "web" ? (
        <>
          {/* <Button title="Reload WebView" onPress={reloadWebView} /> */}
          <WebView
            key={refereshkey}
            className="z-20"
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            onLoad={handleWebViewMessage}
            onLoadEnd={() => console.log("WebView Fully Loaded")}
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
