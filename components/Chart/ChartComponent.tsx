import React, { useCallback, useEffect, useRef } from "react";
import { Platform, TouchableOpacity, BackHandler } from "react-native";
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
	iFrameRef: React.RefObject<HTMLIFrameElement | any>;
	webViewhtmlContent: any;
	iFramehtmlContent: any;
	onMessage?: (event: any) => void;
	activeTab?: string;
	showToggleOrientation?: boolean;
	showToolbar?: boolean;
	iFrameWidth?: string | number | undefined;
	setLoading?: any;
	isTooltipEnabled?: boolean;
	isChartEmpty?: boolean;
	setIsChartLoaded?: any;
	setMaxMinValues?: any;
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
	iFrameWidth = "100%",
	setLoading,
	isTooltipEnabled,
	isChartEmpty = false,
	setIsChartLoaded,
	setMaxMinValues,
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
		const handleBackPress = () => {
			if (isLandscape) {
				ScreenOrientation.lockAsync(
					ScreenOrientation.OrientationLock.PORTRAIT
				);
				dispatch(setOrientation(false));
				return true;
			}
			return false;
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

	useEffect(() => {
		if (Platform.OS !== "web") return;

		const handleChartUpdate = () => {
			setLoading(true);
		};

		const handleChartUpdated = () => {
			if (LoaderTimeoutRef?.current) {
				clearTimeout(LoaderTimeoutRef.current);
			}
			LoaderTimeoutRef.current = setTimeout(() => {
				setLoading(false);
			}, 1000);
		};

		const handleLoaderAction = (shouldStart: boolean) => {
			if (shouldStart) {
				setLoading(true);
			} else {
				setTimeout(() => setLoading(false), 2000);
			}
		};

		const receiveMessage = (event: MessageEvent) => {
			const { message, source, values } = event?.data;
			if (source === "react-devtools-bridge") return;

			const isYearTab = activeTab === "Year" || activeTab === "Year_3";

			// Handle chart updates
			if (
				message === "updateChartSeries" ||
				message === "updateChartOptions"
			) {
				handleChartUpdate();
			} else if (message === "Chart updated") {
				handleChartUpdated();
			}
			// Handle loader actions
			else if (
				message === "startLoader" ||
				(isYearTab && message === "Zoom Start")
			) {
				handleLoaderAction(true);
			} else if (
				message === "stopLoader" ||
				(isYearTab && message === "Zoomed")
			) {
				handleLoaderAction(false);
			}
			// Handle max/min values
			else if (message === "highLightedMaxMin") {
				setMaxMinValues(values ? values : "0");
			}

			//console.log(`Message from ${source} iframe:`, event.data);
		};

		window.addEventListener("message", receiveMessage);
		return () => window.removeEventListener("message", receiveMessage);
	}, [activeTab]);

	return (
		<>
			{Platform.OS !== "web" ? (
				<>
					{showToolbar && !isChartEmpty && (
						<ToolBarFloatingActionMenu
							webViewRef={webViewRef}
							captureWebView={captureWebView}
							isTooltipEnabled={isTooltipEnabled}
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
							className="z-50 "
							ref={webViewRef}
							originWhitelist={["*"]}
							source={{ html: webViewhtmlContent }}
							onLoadStart={() => {}}
							onLoad={() => {}}
							onLoadEnd={() => {
								setIsChartLoaded(true);
							}}
							onMessage={onMessage}
							onFileDownload={({ nativeEvent }: any) => {
								const { downloadUrl } = nativeEvent;
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
									isLandscape
										? "zoom-in-map"
										: "zoom-out-map"
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
					onLoad={() => setIsChartLoaded(true)}
				/>
			)}
		</>
	);
};

export default ChartComponent;
