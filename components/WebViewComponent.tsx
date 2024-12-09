import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import { WebView } from "react-native-webview"; // ^13.6.4
const WebViewComponent = ({ htmlcontentIframe, refVar, onLoad }: any) => {
  return Platform.OS !== "web" ? (
    <WebView
      ref={refVar}
      originWhitelist={["*"]}
      source={{ html: htmlcontentIframe }}
      style={styles.webview}
      injectedJavaScriptBeforeContentLoaded={htmlcontentIframe}
      scrollEnabled={false} // Disable scrolling in the WebView
      javaScriptEnabled={true} // Ensure JavaScript is enabled for the chart to work
      domStorageEnabled={true} // Enable DOM storage
      useWebkit={true} // Use Webkit for better performance
      allowsFullscreenVideo={true} // If you need to enable fullscreen for videos
      overScrollMode="never" // Prevent over-scrolling
      gestureHandling="auto" // Disable gestures (panning, zooming)
      showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
      showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
      setWebContentsDebuggingEnabled={true}
      androidHardwareAccelerationDisabled={true} // Optional: Can help performance
      pointerEvents="auto"
      onShouldStartLoadWithRequest={(request) => {
        if (request.url !== htmlcontentIframe) {
          return false; // Prevent loading external URLs
        }
        return true;
      }}
      injectedJavaScript={`(function() {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
  })();`}
    />
  ) : (
    <iframe
      ref={refVar}
      srcDoc={htmlcontentIframe}
      onLoad={onLoad}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        overflow: "hidden",
        pointerEvents: "auto", // Prevents any interaction or scrolling
      }}
      scrolling="no" // Hides scrollbars in most browsers
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  webview: {
    flex: 1,
  },
});
export default WebViewComponent;
