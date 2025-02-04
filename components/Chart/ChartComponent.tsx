import React, { useCallback, useEffect, useRef } from "react";
import { Platform, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setOrientation } from "@/store/chartSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import ToolBarFloatingActionMenu from "@/components/ToolBarFAB";
import WebView from "react-native-webview";
import ViewShot from "react-native-view-shot";
import Toast from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ScreenOrientation from "expo-screen-orientation";

type ChartComponentProps = {
    webViewRef: React.RefObject<WebView | any>;
    iFrameRef?: React.RefObject<HTMLIFrameElement | any>;
    onMessage?: (event: any) => void;
    id?: number;
    activeTab?: string;
    webViewhtmlContent?: any;
    iFramehtmlContent?: any;
    showToggleOrientation?: boolean;
    showToolbar?: boolean;
    showToggle?: boolean;
    iFrameWidth?: string | number | undefined;
    setLoading?: any;
    isTooltipEnabled?: boolean;
    isChartEmpty?: boolean;
};

const ChartComponent: React.FC<ChartComponentProps> = ({
    webViewRef,
    iFrameRef,
    onMessage,
    activeTab,
    webViewhtmlContent,
    iFramehtmlContent,
    showToggleOrientation = true,
    showToolbar = true,
    showToggle,
    iFrameWidth = "100%",
    setLoading,
    isTooltipEnabled,
    isChartEmpty,
}) => {
    const dispatch = useDispatch();
    const viewShotRef = useRef<any>(null);
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    const LoaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const toggleOrientation = async () => {
        if (Platform.OS != "web") {
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
                (webViewRef?.current as any)?.injectJavaScript(
                    `updateChartOptions(${JSON.stringify({
                        chart: {
                            height: 285,
                        },
                        xaxis: {
                            labels: {
                                show: true,
                                rotate: 0,
                                rotateAlways: true,
                                position: "top",
                                textAnchor: "end",
                                hideOverlappingLabels: false,
                                showDuplicates: false,
                                trim: false,
                                maxHeight: 120,
                            },
                        },
                    })});`
                );
            }, 500);
            setTimeout(() => {
                dispatch(inActiveLoading());
            }, 2000);
            dispatch(setOrientation(!isLandscape));
        }
    };

    useEffect(() => {
        const handleBackPress = () => {
            if (isLandscape) {
                ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT
                ); // Switch to portrait mode
                dispatch(setOrientation(false)); // Update the state to reflect the change
                return true; // Prevent default back button behavior (optional)
            }
            return false; // Let the default back button behavior proceed if not in landscape
        };

        // Add the back button listener
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        // Cleanup on unmount
        return () => {
            BackHandler.removeEventListener(
                "hardwareBackPress",
                handleBackPress
            );
        };
    }, [isLandscape, dispatch]);

    const captureWebView = useCallback(async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Toast.show({
                    type: "download",
                    text1: "Permission Denied",
                    text2: "Media library access required.",
                    position: "bottom",
                    bottomOffset: 0,
                    visibilityTime: 3000,
                });
                return;
            }

            // Capture WebView
            const uri = await viewShotRef?.current?.capture();

            // Fix 1: Use cacheDirectory instead of documentDirectory
            const fileName = `cockpit_chart_${new Date()
                .toISOString()
                .replace(/[:.]/g, "-")}.png`;

            // Fix 2: Generate correct file path
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

            // Fix 3: Use copyAsync instead of moveAsync (more reliable)
            await FileSystem.copyAsync({
                from: uri,
                to: fileUri,
            });

            // Save to gallery
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("cockpit", asset, false);

            // Show toast
            Toast.show({
                type: "download",
                text1: "Chart saved!",
                text2: "Tap to open",
                position: "bottom",
                bottomOffset: 0,
                visibilityTime: 3000,
                props: { fileUri: fileUri, fileName: fileUri, type: "png" }, // Pass the correct URI
            });
        } catch (error) {
            Toast.show({
                type: "download",
                text1: "Permission Denied",
                text2: "Failed to saved image.",
                position: "bottom",
                bottomOffset: 0,
                visibilityTime: 3000,
            });
        }
    }, []);

    useEffect(() => {
        if (Platform.OS === "web") {
            const receiveMessage = (event: MessageEvent) => {
                if (event.data?.source === "react-devtools-bridge") {
                    return; // Ignore DevTools messages
                }
                console.log("Message from iframe:", event.data);

                if (
                    event.data === "updateChartSeries" ||
                    event.data === "updateChartOptions"
                ) {
                    setLoading(true);
                }
                if (event.data === "Chart updated") {
                    if (LoaderTimeoutRef.current) {
                        clearTimeout(LoaderTimeoutRef.current);
                    }
                    // Assign new timeout without optional chaining
                    LoaderTimeoutRef.current = setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                }

                // Handle loader actions on tooltip toggle
                if (
                    event.data === "startLoader" ||
                    ((activeTab === "Year" || activeTab === "Year_3") &&
                        event.data === "Zoom Start")
                ) {
                    setLoading(true);
                } else if (
                    event.data === "stopLoader" ||
                    ((activeTab === "Year" || activeTab === "Year_3") &&
                        event.data === "Zoomed")
                ) {
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000);
                }
            };

            window.addEventListener("message", receiveMessage);
            return () => window.removeEventListener("message", receiveMessage);
        }
    }, []);
    return (
        <>
            {Platform.OS !== "web" ? (
                <>
                    {showToolbar && !isChartEmpty ? (
                        <ToolBarFloatingActionMenu
                            webViewRef={webViewRef}
                            showToggle={showToggle}
                            captureWebView={captureWebView}
                            isTooltipEnabled={isTooltipEnabled}
                        />
                    ) : null}
                    <ViewShot
                        ref={viewShotRef}
                        options={{
                            format: "png",
                            quality: 1,
                        }}
                        style={{ flex: 1, padding: 1 }}
                    >
                        <WebView
                            className="z-50 "
                            ref={webViewRef}
                            originWhitelist={["*"]}
                            source={{ html: webViewhtmlContent }}
                            onLoadStart={() =>
                                console.log("WebView start Load")
                            }
                            onLoad={() => console.log("WebView Loaded")}
                            onLoadEnd={() => console.log("WebView end Load")}
                            onMessage={onMessage}
                            onFileDownload={({ nativeEvent }: any) => {
                                const { downloadUrl } = nativeEvent;
                                console.log("DownloadUrl", downloadUrl);
                            }}
                            onHttpError={(syntheticEvent) => {
                                const { statusCode } =
                                    syntheticEvent.nativeEvent;
                                console.log(
                                    "HTTP error status code",
                                    statusCode
                                );
                            }}
                            containerStyle={{
                                overflow: "hidden",
                                width: "100%",
                                height: "90%",
                                // border: "2px solid black", // Adding a 2px solid black border
                                pointerEvents: "auto",
                                marginVertical: 0,
                                padding: 5,
                            }}
                            overScrollMode="content"
                            gestureHandling="auto"
                            injectedJavaScriptBeforeContentLoaded={
                                webViewhtmlContent
                            }
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
                            startInLoadingState
                        />
                    </ViewShot>
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
                                name={
                                    isLandscape ? "zoom-in-map" : "zoom-out-map"
                                }
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
                        width: iFrameWidth,
                        height: "100%",
                        border: "none",
                        overflow: "hidden",
                        pointerEvents: "auto",
                        // margin: 1,
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

// const captureWebView = useCallback(async () => {
//     try {
//         const uri = await viewShotRef?.current?.capture(); // Capture the WebView
//         console.log("Captured URI:", uri);

//         // Save the file locally
//         const fileUri = `${FileSystem.documentDirectory}webview_capture.png`;
//         const fileName = `${
//             FileSystem.documentDirectory
//         }cockpi_chart_${new Date()
//             .toISOString()
//             .replace(/:/g, "-")
//             .replace(/T/, "_")
//             .replace(/\..+/, "")}.png`;
//         await FileSystem.moveAsync({
//             from: uri,
//             to: fileName,
//         });

//         // Alert.alert("Success", "Screenshot saved to your device!");

//         // Share the file
//         if (await Sharing.isAvailableAsync()) {
//             await Sharing.shareAsync(fileName);
//         } else {
//             Alert.alert(
//                 "Sharing not available",
//                 "The image is saved to your device."
//             );
//         }
//     } catch (error) {
//         // console.error("Error capturing WebView:", error);
//         Alert.alert("Error", "Failed to capture WebView.");
//     }
// }, []);
