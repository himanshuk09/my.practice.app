import {
	getPortfolioDeals,
	getPortfolioDetails,
	getPortfolioReportBase64PDF,
} from "@/services/portfolio.service";
import {
	updateApexChart,
	updateAreaApexChartLocale,
	updateDonutApexChartLocale,
	updateEmptyApexChart,
} from "@/components/chart/chartUpdateFunctions";
import {
	exportBase64ToPDF,
	exportBase64ToPDFWeb,
} from "@/components/exportcsv/exporttofile";
import {
	iframeAreaHtmlContent,
	iframeDonutChartHtmlContent,
	webviewAreaHtmlContent,
	webviewDonutChartHtmlContent,
} from "@/components/chart/config";
import { RootState } from "@/store/store";
import { i18n } from "@/localization/config";
import { NETWORKKEYS, PERMISSIONKEYS } from "@/utils/messages";
import { useDebounce } from "@/hooks/useDebounce";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import NoNetwork from "@/components/icons/NoNetwork";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { inActiveLoading } from "@/store/navigationSlice";
import { Toast, showToast } from "@/components/ToastConfig";
import { ChartGraphShimmer } from "@/components/ChartShimmer";
import ChartComponent from "@/components/chart/ChartComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Transactions, { DataDisplay } from "@/components/TranscationCard";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";
import { View, Modal, Platform, StyleSheet, SafeAreaView } from "react-native";

const PortfolioOverView = () => {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams();
	const rawId = id as string;
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const donutwebViewRef = useRef<WebView | null>(null);
	const areaWebViewRef = useRef<WebView | null>(null);
	const donutIFrameRef = useRef<HTMLIFrameElement>(null);
	const areaIFrameRef = useRef<HTMLIFrameElement>(null);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
	const [isDonutChartLoaded, setIsDonutChartLoaded] =
		useState<boolean>(false);
	const [isEnabledToCallDeals, setEnabledToCallDeals] =
		useState<boolean>(false);
	const [showPieChart, setShowPieChart] = useState<boolean>(false);
	const [showAreaChart, setShowAreaChart] = useState<boolean>(false);

	const locale = useSelector((state: RootState) => state.culture.locale);
	const LoaderPieTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const LoaderAreaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	const paramsID = useMemo(() => {
		try {
			return rawId ? JSON.parse(decodeURIComponent(rawId)) : {};
		} catch (err) {
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
		// deps: [],
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
	};

	const updateLocale = () => {
		updateAreaApexChartLocale({
			locale,
			date: paramsID?.PortfolioDate,
			fileName: paramsID?.PortfolioName,
			webViewRef: areaWebViewRef,
			iFrameRef: areaIFrameRef,
		});
		updateDonutApexChartLocale({
			locale,
			webViewRef: donutwebViewRef,
			iFrameRef: donutIFrameRef,
		});
	};

	const debouncedExport = useDebounce(() => exportPortfolioReport(), 1000);
	const exportPortfolioReport = async () => {
		if (!isOnline || portfolioDetails?.message === "no data") return;

		const toastId = Toast.show({
			type: "download",
			text1: i18n.t("File_Downloading"),
			position: "bottom",
			bottomOffset: Platform.OS === "web" ? 0 : 40,
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
				title: PERMISSIONKEYS.DOWNLOAD_FAILED,
			});
		} finally {
			Toast.hide(toastId);
		}
	};

	useEffect(() => {
		if (portfolioDetails && isChartLoaded && isDonutChartLoaded) {
			if (portfolioDetails?.message === "no data") {
				updateEmptyApexChart({
					webViewRef: donutwebViewRef,
					iFrameRef: donutIFrameRef,
					chartType: "donut",
				});
				updateEmptyApexChart({
					webViewRef: areaWebViewRef,
					iFrameRef: areaIFrameRef,
					chartType: "area",
				});
				setEnabledToCallDeals(false);
				if (Platform.OS === "web") {
					setShowAreaChart(true);
					setShowPieChart(true);
				}
				return;
			}

			updateLocale();
			updateApexChart({
				type: "chart",
				webViewRef: donutwebViewRef,
				iFrameRef: donutIFrameRef,
				data: portfolioDetails?.donotChartData,
				options: { title: { text: paramsID?.PortfolioName } },
			});
			updateApexChart({
				type: "series",
				webViewRef: areaWebViewRef,
				iFrameRef: areaIFrameRef,
				data: portfolioDetails?.areaChartData,
				options: {},
			});

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
	if (portfolioError === NETWORKKEYS.NO_INTERNET) {
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
				{!showPieChart && !showAreaChart && <ChartGraphShimmer />}

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
						onPress={debouncedExport}
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
				{!showPieChart && !showAreaChart && <ChartGraphShimmer />}
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

			{/* Bottom  Botton*/}
			<PrimaryButton
				title={"View_Deals"}
				onPress={() => setModalVisible(!modalVisible)}
			/>

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
