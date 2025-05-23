import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { i18n } from "@/localization/config";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import ChartComponent from "@/components/Chart/ChartComponent";
import { ChartGraphSimmer } from "@/components/ChartShimmer";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Transactions, { DataDisplay } from "@/components/TranscationCard";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";
import NoNetwork from "@/components/icons/NoNetwork";
import { Toast, showToast } from "@/components/ToastConfig";
import {
	View,
	Platform,
	SafeAreaView,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	Modal,
	Animated,
} from "react-native";
import {
	getPortfolioDeals,
	getPortfolioDetails,
	getPortfolioReportBase64PDF,
} from "@/services/portfolio.service";
import {
	updateApexChart,
	updateEmptyChart,
} from "@/components/Chart/chartUpdateFunctions";
import {
	exportBase64ToPDF,
	exportBase64ToPDFWeb,
} from "@/components/exportcsv/exporttofile";
import {
	iframeAreaHtmlContent,
	iframeDonutChartHtmlContent,
	webviewAreaHtmlContent,
	webviewDonutChartHtmlContent,
} from "@/components/Chart/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";

const PortfolioOverView = () => {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams();
	const rawId = id as string;
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const donutwebViewRef = useRef<WebView | null>(null);
	const areaWebViewRef = useRef<WebView | null>(null);
	const donutIFrameRef = useRef<HTMLIFrameElement | any>(null);
	const areaIFrameRef = useRef<HTMLIFrameElement | any>(null);
	const screenHeight = Dimensions.get("window").height;
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
	const [isDonutChartLoaded, setIsDonutChartLoaded] =
		useState<boolean>(false);
	const [isEnabledToCallDeals, setEnabledToCallDeals] =
		useState<boolean>(false);
	const [showPieChart, setShowPieChart] = useState<boolean>(false);
	const [showAreaChart, setShowAreaChart] = useState<boolean>(false);
	const locale = useSelector((state: RootState) => state.culture.locale);
	const LoaderPieTimeoutRef = useRef<NodeJS.Timeout | null | any>(null);
	const LoaderAreaTimeoutRef = useRef<NodeJS.Timeout | null | any>(null);
	const paramsID = useMemo(() => {
		try {
			return rawId ? JSON.parse(decodeURIComponent(rawId)) : {};
		} catch {
			return {};
		}
	}, [rawId]);

	//  Fetch portfolio details with hook
	const {
		data: portfolioDetails = {
			areaChartData: [],
			donotChartData: [],
			closedData: [],
			openData: [],
			message: "",
		},
		loading: isDetailsLoading,
		error: portfolioError,
		isOnline,
		refetch,
	} = useNetworkAwareApiRequest(getPortfolioDetails, {
		params: paramsID,
		autoFetch: !!paramsID?.PortfolioId,
		enabled: !!paramsID?.PortfolioId,
		showGlobalLoader: false,
		deps: [paramsID?.PortfolioId],
	});

	// Network Aware Hook for portfolio deals
	const {
		data: dealsData,
		loading: isDealsLoading,
		error: dealsError,
		refetch: RefetchDeals,
	} = useNetworkAwareApiRequest(getPortfolioDeals, {
		params: paramsID,
		enabled: isEnabledToCallDeals,
		autoFetch: isEnabledToCallDeals,
		showGlobalLoader: false,
		// deps: [modalVisible],
	});

	const onMessage = (event: WebViewMessageEvent) => {
		const message = JSON.parse(event.nativeEvent.data);
		const { action, values } = message;
		// Handle messages from charts if needed
		if (action === "Area Chart updated") {
			if (LoaderAreaTimeoutRef.current)
				clearTimeout(LoaderAreaTimeoutRef.current);
			LoaderAreaTimeoutRef.current = setTimeout(() => {
				setShowAreaChart(true);
			}, 500);
		}
		if (action === "Pie Chart updated") {
			if (LoaderPieTimeoutRef.current)
				clearTimeout(LoaderPieTimeoutRef.current);
			LoaderPieTimeoutRef.current = setTimeout(() => {
				setShowPieChart(true);
			}, 500);
		}

		console.log(action, values);
	};

	const updateLocale = () => {
		if (Platform.OS === "web") {
			const iframe = areaIFrameRef.current;
			if (iframe && iframe?.contentWindow) {
				iframe?.contentWindow?.updateLocale?.(
					locale,
					`${new Date(paramsID?.PortfolioDate).getFullYear()}`
				);
			}
			if (
				donutIFrameRef?.current &&
				donutIFrameRef?.current?.contentWindow
			) {
				donutIFrameRef?.current?.contentWindow?.updateLocale?.(locale);
			}
		} else {
			if (areaWebViewRef?.current) {
				const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}', ${new Date(paramsID?.PortfolioDate).getFullYear()});}`;

				areaWebViewRef.current.injectJavaScript(updateLocaleScript);
			}
			if (donutwebViewRef?.current) {
				let updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;
				donutwebViewRef?.current.injectJavaScript(updateLocaleScript);
			}
		}
	};

	const exportPortfolioReport = async () => {
		if (!isOnline || portfolioDetails?.message === "no data") return;

		const toastId = Toast.show({
			type: "download",
			text1: i18n.t("File_Downloading"),
			position: "bottom",
			autoHide: false,
			props: { spinner: true },
		});

		try {
			const response = await getPortfolioReportBase64PDF(paramsID);

			const fileName =
				paramsID?.PortfolioName?.replace(
					/[&\/\\#,+()$~%.'":*?<>{}]/g,
					""
				) || "portfolio";

			if (Platform.OS === "web") {
				exportBase64ToPDFWeb(response, `${fileName}_details.pdf`);
			} else {
				exportBase64ToPDF(response, `${fileName}_details.pdf`);
			}
		} catch (error) {
			showToast({
				type: "error",
				title: "Download_Failed",
			});
			console.error("Error downloading portfolio report:", error);
		} finally {
			Toast.hide(toastId);
		}
	};

	useEffect(() => {
		if (portfolioDetails && isChartLoaded && isDonutChartLoaded) {
			if (portfolioDetails?.message === "no data") {
				updateEmptyChart(donutwebViewRef, donutIFrameRef, "donut");
				updateEmptyChart(areaWebViewRef, areaIFrameRef, "area");
				setEnabledToCallDeals(false);
				if (Platform.OS === "web") {
					setShowAreaChart(true);
					setShowPieChart(true);
				}
				return;
			}

			updateLocale();
			updateApexChart(
				"chart",
				donutwebViewRef,
				donutIFrameRef,
				portfolioDetails?.donotChartData,
				{ title: { text: paramsID?.PortfolioName } }
			);

			updateApexChart(
				"series",
				areaWebViewRef,
				areaIFrameRef,
				portfolioDetails?.areaChartData
			);

			setEnabledToCallDeals(true);
			if (Platform.OS === "web") {
				setShowAreaChart(true);
				setShowPieChart(true);
			}
		}
	}, [isChartLoaded, isDonutChartLoaded, portfolioDetails]);
	useEffect(() => {
		if (isFocused) {
			setTimeout(() => {
				dispatch(inActiveLoading());
			}, 500);
		}
	}, [isFocused]);

	/**
	 * Return
	 */
	if (portfolioError === "No internet connection") {
		return <NoNetwork />;
	}

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{ marginBottom: insets.bottom }}
		>
			{/* Top Chart Section */}
			<View
				className="flex flex-row justify-between"
				style={{ height: 160 }} // Use reasonable fixed height for top
			>
				{!showPieChart && !showAreaChart && <ChartGraphSimmer />}

				<ChartComponent
					webViewRef={donutwebViewRef}
					iFrameRef={donutIFrameRef}
					onMessage={onMessage}
					webViewhtmlContent={webviewDonutChartHtmlContent}
					iFramehtmlContent={iframeDonutChartHtmlContent}
					showToggleOrientation={false}
					showToolbar={false}
					iFrameWidth="50%"
					setIsChartLoaded={setIsDonutChartLoaded}
				/>

				<View className="flex-col justify-start w-[33%] md:w-[10%]">
					<DataDisplay
						data={portfolioDetails?.closedData[0]}
						title="Closed"
						locale={locale}
					/>
					<DataDisplay
						data={portfolioDetails?.openData[0]}
						title="Open"
						locale={locale}
					/>
				</View>

				<View
					className="ml-7 mt-3"
					style={{ marginRight: Platform.OS === "web" ? "10%" : 20 }}
				>
					<FontAwesome5
						name="file-download"
						size={25}
						color="#ef4444"
						onPress={exportPortfolioReport}
					/>
				</View>
			</View>

			{/* Divider */}
			<View className="h-1 bg-[#DEDEDE] mt-1" />

			{/* Area Chart Section */}
			<View
				className="flex-1"
				style={{
					paddingTop: Platform.OS !== "web" ? 15 : undefined,
					padding: 3,
				}}
			>
				{!showPieChart && !showAreaChart && <ChartGraphSimmer />}
				<ChartComponent
					isChartEmpty={portfolioDetails?.message === "no data"}
					webViewRef={areaWebViewRef}
					iFrameRef={areaIFrameRef}
					onMessage={onMessage}
					webViewhtmlContent={webviewAreaHtmlContent}
					iFramehtmlContent={iframeAreaHtmlContent}
					showToggleOrientation={false}
					setIsChartLoaded={setIsChartLoaded}
				/>
			</View>

			{/* Bottom CTA */}
			<TouchableOpacity
				className="bg-[#e31836] py-3 mx-5 rounded-sm"
				onPress={() => setModalVisible(!modalVisible)}
			>
				<Text className="text-white text-center text-base font-normal uppercase">
					{i18n.t("View_Deals")}
				</Text>
			</TouchableOpacity>

			{/* Modal */}
			<Modal
				animationType="fade"
				transparent={false}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View
					className="h-full w-full absolute flex-1"
					style={StyleSheet.absoluteFill}
				>
					<Transactions
						cards={dealsData}
						setModalVisible={setModalVisible}
						modalVisible={modalVisible}
						title={paramsID?.PortfolioName}
						onRefresh={RefetchDeals}
						isRefreshing={isDealsLoading}
					/>
				</View>
			</Modal>
		</SafeAreaView>
	);
};
export default PortfolioOverView;
