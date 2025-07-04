import { RootState } from "@/store/store";
import WebView from "react-native-webview";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { PERMISSIONKEYS } from "@/utils/messages";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
import { CircularLoaderDefault } from "../Loader";
import CustomAlert from "@/components/CustomAlert";
import { setOrientation } from "@/store/chartSlice";
import { showToast } from "@/components/ToastConfig";
import { useDispatch, useSelector } from "react-redux";
import { ChartComponentProps } from "@/types/chart.type";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useCallback, useEffect, useRef } from "react";
import ToolBarFloatingActionMenu from "@/components/ToolBarFAB";
import { Platform, TouchableOpacity, Linking } from "react-native";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

const ChartComponent: React.FC<ChartComponentProps> = ({
	webViewRef,
	iFrameRef,
	webViewhtmlContent,
	iFramehtmlContent,
	onMessage,
	activeTab,
	isTooltipEnabled,
	iFrameWidth = "100%",
	setShowChartShimmer,
	setLoading = () => {},
	setIsChartLoaded,
	setMaxMinValues,
	showToolbar = true,
	isChartEmpty = false,
	showToggleOrientation = true,
}) => {
	const dispatch = useDispatch();
	const viewShotRef = useRef<any>(null);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const LoaderTimeoutRef = useRef<NodeJS.Timeout | number>(null);

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
				dispatch(inActiveLoading());
			}, 2000);
			dispatch(setOrientation(!isLandscape));
		}
	};

	const captureWebView = useCallback(async () => {
		try {
			const { status } = await MediaLibrary.requestPermissionsAsync();

			if (status !== "granted") {
				CustomAlert({
					title: PERMISSIONKEYS.PERMISSION_REQUIRED,
					description: PERMISSIONKEYS.ENABLE_PERMISSION,
					cancelText: PERMISSIONKEYS.ASK_ME_LATER,
					confirmText: PERMISSIONKEYS.OPEN_SETTINGS,
					onConfirm: () => Linking.openSettings(),
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
			showToast({
				type: "download",
				title: PERMISSIONKEYS.CHART_SAVED,
				subtitle: PERMISSIONKEYS.TAP_TO_OPEN,
				props: { fileUri: fileUri, fileName: fileUri, type: "png" }, // Pass the correct URI
			});
		} catch (error) {
			showToast({
				type: "error",
				title: PERMISSIONKEYS.PERMISSION_DENIED,
				subtitle: PERMISSIONKEYS.ENABLE_PERMISSION,
			});
		}
	}, []);

	/**
	 * For only web Chart
	 */
	useEffect(() => {
		if (Platform.OS !== "web") return;
		const receiveMessage = (event: MessageEvent) => {
			const { message, source, values } = event?.data;
			if (source === "react-devtools-bridge") return;

			// Handle chart updates
			switch (message) {
				case "updateChartSeries":
				case "updateChartOptions":
					setLoading(true);
					break;

				case "Chart updated":
					if (LoaderTimeoutRef?.current) {
						clearTimeout(LoaderTimeoutRef.current);
					}
					LoaderTimeoutRef.current = setTimeout(() => {
						setLoading(false);
					}, 500);
					break;

				case "startLoader":
					// setLoading(true);
					break;

				case "stopLoader":
					// setTimeout(() => setLoading(false), 2000);
					break;

				case "highLightedMaxMin":
					setMaxMinValues?.(
						values || {
							minX: 0,
							minY: 0,
							maxX: 0,
							maxY: 0,
						}
					);
					break;
				case "animationEnd":
				case "Empty Series":
					setTimeout(() => {
						setShowChartShimmer?.(false);
					}, 500);
					break;

				default:
					break;
			}
		};

		window.addEventListener("message", receiveMessage);
		return () => window.removeEventListener("message", receiveMessage);
	}, [activeTab]);

	return (
		<React.Fragment>
			{Platform.OS !== "web" ? (
				<React.Fragment>
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
							// className="z-50"
							ref={webViewRef}
							originWhitelist={["*"]}
							source={{ html: webViewhtmlContent }}
							onLoadStart={() => {}}
							onLoad={() => {}}
							onLoadEnd={() => {
								setIsChartLoaded?.(true);
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
								padding: 2,
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
							renderError={(error) => {
								console.warn("WebView error", error);
								return <CircularLoaderDefault />;
							}}
							renderLoading={() => {
								return <CircularLoaderDefault />;
							}}
							renderToHardwareTextureAndroid
							startInLoadingState
						/>
					</ViewShot>
					{showToggleOrientation && !isChartEmpty && (
						<TouchableOpacity
							style={{
								position: "absolute",
								bottom: 10,
								right: 20,
								zIndex: 48,
							}}
							onPress={toggleOrientation}
						>
							<MaterialIcons
								name={
									isLandscape ? "zoom-in-map" : "zoom-out-map"
								}
								size={20}
								color="gray"
							/>
						</TouchableOpacity>
					)}
				</React.Fragment>
			) : (
				<iframe
					ref={iFrameRef}
					srcDoc={iFramehtmlContent}
					style={{
						width: iFrameWidth,
						height: "100%",
						border: "none",
						overflow: "hidden",

						// margin: 1,
					}}
					onLoad={() => setIsChartLoaded?.(true)}
				/>
			)}
		</React.Fragment>
	);
};

export default ChartComponent;
