import {
    Platform,
    TouchableOpacity,
    BackHandler,
    StyleSheet,
    View,
    Text,
    Alert,
    ToastAndroid,
} from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import WebView from "react-native-webview";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setOrientation } from "@/store/chartSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import ToolBarFloatingActionMenu from "@/components/ToolBarFAB";
import ViewShot from "react-native-view-shot";

type ChartComponentProps = {
    webViewRef: React.RefObject<WebView | any>;
    iFrameRef?: React.RefObject<HTMLIFrameElement | any>;
    onMessage?: (event: any) => void;
    id?: number;
    refereshkey?: number;
    activeTab?: string;
    webViewhtmlContent?: any;
    iFramehtmlContent?: any;
    showToggleOrientation?: boolean;
    showToolbar?: boolean;
    showToggle?: boolean;
    iFrameWidth?: string | number | undefined;
    UpdateXaxisFormate?: any;
    setLoading?: any;
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
    showToggle,
    iFrameWidth = "100%",
    UpdateXaxisFormate,
    setLoading,
}) => {
    const dispatch = useDispatch();
    const viewShotRef = useRef<any>(null);
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
                    // chart: {
                    //     height: 270,
                    // },
                    xaxis: {
                        // labels: {
                        //     rotate: 0,
                        //     rotateAlways: false,
                        // },
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
                            offsetX: -1,
                            offsetY: -2,
                        },
                    },
                })});`
            );
        }, 500);
        setTimeout(
            () => {
                // UpdateXaxisFormate();
                dispatch(inActiveLoading());
            },
            activeTab === "Year" || activeTab === "Year_3" ? 5000 : 3000
        );
        setTimeout(
            () => {
                setLoading(false);
            },
            activeTab === "Year" || activeTab === "Year_3" ? 6000 : 4000
        );
        dispatch(setOrientation(!isLandscape));
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
            // Request permission to access the media library (for saving to gallery)
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "Permission to access the media library is required."
                );
                return;
            }

            // Capture the WebView content
            const uri = await viewShotRef?.current?.capture();
            console.log("Captured URI:", uri);

            // Generate a file name based on the current date/time
            const fileName = `${
                FileSystem.documentDirectory
            }cockpit_chart_${new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/T/, "_")
                .replace(/\..+/, "")}.png`;

            // Move the captured URI to the local file system
            await FileSystem.moveAsync({
                from: uri,
                to: fileName,
            });

            // Save the captured file to the media library (gallery)
            const asset = await MediaLibrary.createAssetAsync(fileName);
            await MediaLibrary.createAlbumAsync("cockpit", asset, false); // 'false' means not to create a new album

            // Alert the user that the file has been saved

            ToastAndroid.show(
                "Chart saved to your gallery!",
                ToastAndroid.SHORT
            );
            // Check if sharing is available and then share the file
            // if (await Sharing.isAvailableAsync()) {
            //     await Sharing.shareAsync(fileName);
            // } else {
            //     Alert.alert(
            //         "Sharing not available",
            //         "The image is saved to your device."
            //     );
            // }
        } catch (error) {
            // console.error("Error capturing WebView:", error);
            Alert.alert("Error", "Failed to capture Chart.");
            ToastAndroid.show("Failed to Save Chart.", ToastAndroid.LONG);
        }
    }, []);

    return (
        <>
            {Platform.OS !== "web" ? (
                <>
                    {showToolbar && (
                        <ToolBarFloatingActionMenu
                            webViewRef={webViewRef}
                            showToggle={showToggle}
                            captureWebView={captureWebView}
                        />
                    )}
                    <ViewShot
                        ref={viewShotRef}
                        options={{
                            format: "png",
                            quality: 1,
                        }}
                        style={{ flex: 1, padding: 1 }}
                    >
                        <WebView
                            key={refereshkey}
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
                            // startInLoadingState
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
// Assuming WebView is in use
