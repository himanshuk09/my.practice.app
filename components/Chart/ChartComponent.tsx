import {
  View,
  Text,
  Platform,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { htmlContent, iframehtmlcontent } from "./charthtmlcontent";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setOrientation } from "@/store/chartSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

type ChartComponentProps = {
  webViewRef?: React.RefObject<any>;
  iFrameRef?: React.RefObject<any>;
  onMessage?: (event: any) => void;
  id?: number;
  refereshkey?: number;
  activeTab?: string;
};
const ChartComponent: React.FC<ChartComponentProps> = ({
  webViewRef,
  iFrameRef,
  onMessage,
  id,
  refereshkey,
  activeTab,
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
  const dispatch = useDispatch();
  const isLandscape = useSelector(
    (state: RootState) => state.orientation.isLandscape
  );
  // const checkOrientation = async () => {
  //   const orientationInfo = await ScreenOrientation.getOrientationAsync();
  //   const isLandscapeMode =
  //     orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
  //     orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  //   // Dispatch the action to update Redux state
  //   dispatch(setOrientation(isLandscapeMode));
  // };
  // useEffect(() => {
  //   checkOrientation(); // Check the initial orientation
  //   const subscription = ScreenOrientation.addOrientationChangeListener(() => {
  //     checkOrientation(); // Check orientation when it changes
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     subscription.remove();
  //   };
  // }, [dispatch]);
  // Function to toggle the orientation lock
  const toggleOrientation = async () => {
    dispatch(activeLoading());
    if (isLandscape) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }

    setTimeout(() => {
      // webViewRef?.current?.reload();
      (webViewRef?.current as any)?.injectJavaScript(
        `updateChartOptions(${JSON.stringify({
          chart: {
            height: 280,
          },
          xaxis: {
            labels: {
              rotate: 0,
              rotateAlways: false,
            },
          },
        })});`
      );
    }, 500);
    setTimeout(() => {
      dispatch(inActiveLoading());
    }, 2000);
    dispatch(setOrientation(!isLandscape));
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (isLandscape) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Switch to portrait mode
        dispatch(setOrientation(false)); // Update the state to reflect the change
        return true; // Prevent default back button behavior (optional)
      }
      return false; // Let the default back button behavior proceed if not in landscape
    };

    // Add the back button listener
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    // Cleanup on unmount
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [isLandscape, dispatch]);
  return (
    <>
      {Platform.OS !== "web" ? (
        <>
          <WebView
            key={refereshkey}
            className="z-50"
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            onLoadStart={() => console.log("WebView start Load")}
            onLoad={() => console.log("WebView Loaded")}
            onLoadEnd={() => console.log("WebView end Load")}
            onMessage={onMessage}
            onFileDownload={({ nativeEvent }: any) => {
              const { downloadUrl } = nativeEvent;
              console.log("DownloadUrl", downloadUrl);
            }}
            onHttpError={(syntheticEvent) => {
              const { statusCode } = syntheticEvent.nativeEvent;
              console.log("HTTP error status code", statusCode);
            }}
            containerStyle={{
              overflow: "hidden",
            }}
            overScrollMode="content"
            gestureHandling="auto"
            injectedJavaScriptBeforeContentLoaded={htmlContent}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            useWebkit={true}
            allowsFullscreenVideo={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            setWebContentsDebuggingEnabled={true}
            scalesPageToFit={true}
            setBuiltInZoomControls={false}
            allowsInlineMediaPlayback={true}
            bounces={false}
            zoomEnabled={false}
            nestedScrollEnabled={true}
            // startInLoadingState
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 10,
              right: 20,
              zIndex: 1000,
            }}
            onPress={toggleOrientation}
          >
            <MaterialIcons
              name={isLandscape ? "zoom-in-map" : "zoom-out-map"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
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
