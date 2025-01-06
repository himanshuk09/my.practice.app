import {
  Platform,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useEffect } from "react";
import WebView from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setOrientation } from "@/store/chartSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import ToolBarFloatingActionMenu from "@/components/ToolBarFAB";

import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
} from "react-native-gesture-handler";
type ChartComponentProps = {
  webViewRef: React.RefObject<any>;
  iFrameRef?: React.RefObject<any>;
  onMessage?: (event: any) => void;
  id?: number;
  refereshkey?: number;
  activeTab?: string;
  webViewhtmlContent?: any;
  iFramehtmlContent?: any;
  showToggleOrientation?: boolean;
  showToolbar?: boolean;
};

const ChartComponent: React.FC<ChartComponentProps> = ({
  webViewRef,
  iFrameRef,
  onMessage,
  refereshkey,
  activeTab,
  webViewhtmlContent,
  iFramehtmlContent,
  showToggleOrientation = true,
  showToolbar = true,
}) => {
  const dispatch = useDispatch();
  const isLandscape = useSelector(
    (state: RootState) => state.orientation.isLandscape
  );

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
            height: 270,
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
    setTimeout(
      () => {
        dispatch(inActiveLoading());
      },
      activeTab === "Year" ? 5000 : 2000
    );
    dispatch(setOrientation(!isLandscape));
  };
  const executeFunction = (functionName: any) => {
    webViewRef.current.injectJavaScript(`${functionName}(); true;`);
  };
  // Handle Pan Gesture for Move Left and Move Right
  const handlePanGesture = (event: any) => {
    const { translationX } = event.nativeEvent;

    if (translationX > 50) {
      console.log("Gesture: Move Right");
    } else if (translationX < -50) {
      console.log("Gesture: Move Left");
    }
  };

  // Handle Pinch Gesture for Pinch In and Pinch Out
  const handlePinchGesture = (event: any) => {
    const { scale } = event.nativeEvent;

    if (scale > 1) {
      console.log("Gesture: Pinch Out");
    } else if (scale < 1) {
      console.log("Gesture: Pinch In");
    }
  };
  const handleGesture = (event: any) => {
    const { translationX } = event.nativeEvent;

    if (translationX > 50) {
      // Swipe right
      executeFunction("customPanRight");
    } else if (translationX < -50) {
      // Swipe left
      executeFunction("customPanLeft");
    }
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
          {showToolbar && <ToolBarFloatingActionMenu webViewRef={webViewRef} />}

          <WebView
            key={refereshkey}
            className="z-50 "
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: webViewhtmlContent }}
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
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "auto",
              margin: 1,
            }}
            overScrollMode="content"
            gestureHandling="auto"
            injectedJavaScriptBeforeContentLoaded={webViewhtmlContent}
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

          {showToggleOrientation && (
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
          )}
        </>
      ) : (
        <iframe
          ref={iFrameRef}
          srcDoc={iFramehtmlContent}
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
