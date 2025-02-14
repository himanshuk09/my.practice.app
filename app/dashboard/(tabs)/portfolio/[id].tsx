import ChartComponent from "@/components/Chart/ChartComponent";
import { inActiveLoading } from "@/store/navigationSlice";
import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Platform,
	SafeAreaView,
	Text,
	TouchableOpacity,
	StatusBar,
	Dimensions,
	StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import {
	iframeAreahtlcontent,
	iFreameDonutChartHtml,
	webviewAreaHtmlcontent,
	webviewDonutChartHtml,
} from "@/components/Chart/charthtmlcontent";
import { i18n } from "@/localization/localConfig";
import { useLocalSearchParams } from "expo-router";
import { RootState } from "@/store/store";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { PortFolioChartShimmer } from "@/components/ChartShimmer";
import {
	getPortfolioDeals,
	getPortfolioDetails,
	getPortfolioReportBase64PDF,
} from "@/services/portfolio.service";
import Transactions, { DataDisplay } from "@/components/TranscationCard";
import { Modal } from "react-native";
import {
	updateApexChart,
	updateEmptyChart,
} from "@/components/Chart/chartUpdateFunctions";
import {
	shareBase64AsPDF,
	saveBase64AsPDFWeb,
} from "@/components/ConstantFunctions/saveCSVFile";
import Toast from "react-native-toast-message";
import {
	FormattedPortfolioDetails,
	PortfolioDetailsError,
	TradeDetailsArray,
} from "@/types/type";

const PortfolioOverView = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
	const [portfolioDetails, setPortfolioDetails] =
		useState<FormattedPortfolioDetails>({
			areaChartData: [],
			donotChartData: [],
			closedData: [],
			openData: [],
			message: "",
		});
	const [portfolioDeals, setPortfolioDeals] = useState<TradeDetailsArray>(
		[]
	);
	const { height: screenHeight } = Dimensions.get("window");
	const locale = useSelector((state: RootState) => state.language.locale);
	const dispatch = useDispatch();
	const donutwebViewRef = useRef<WebView | null>(null);
	const donutIFrameRef = useRef<HTMLIFrameElement | any>(null);
	const areaWebViewRef = useRef<WebView | null>(null);
	const areaIFrameRef = useRef<HTMLIFrameElement | any>(null);
	const { id } = useLocalSearchParams();
	const paramsID = id ? JSON.parse(decodeURIComponent(id as string)) : {};

	const onMessage = async (event: WebViewMessageEvent) => {
		const message = JSON.parse(event.nativeEvent.data);
	};

	const updateLocale = () => {
		if (Platform.OS === "web") {
			const iframe = areaIFrameRef.current;
			if (iframe && iframe?.contentWindow) {
				iframe?.contentWindow?.updateLocale?.(
					locale,
					`Target ${new Date(paramsID?.PortfolioDate).getFullYear()}`
				);
			}
		} else {
			if (areaWebViewRef?.current) {
				const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}', 'Target ${new Date(paramsID?.PortfolioDate).getFullYear()}');}`;

				areaWebViewRef.current.injectJavaScript(updateLocaleScript);
			}
		}
		updateApexChart("options", donutwebViewRef, donutIFrameRef, {
			title: {
				text: paramsID?.PortfolioName,
			},
		});
	};
	const exportPortfolioReport = async () => {
		// Show initial toast indicating download is in progress
		const toastId = Toast.show({
			type: "download",
			text1: "File Downloading....",
			position: "bottom",
			bottomOffset: 0,
			autoHide: false, // Keeps the toast visible
		});

		try {
			// Fetch the portfolio report
			const responsePortfolioReport =
				await getPortfolioReportBase64PDF(paramsID);

			// Hide the previous toast
			Toast.hide(toastId);
			// Save or share the file based on platform
			const fileName = paramsID.PortfolioName.replace(
				/[&\/\\#,+()$~%.'":*?<>{}]/g,
				""
			);
			console.log(fileName);

			if (Platform.OS === "web") {
				saveBase64AsPDFWeb(
					responsePortfolioReport,
					`${fileName}_details.pdf`
				);
			} else {
				shareBase64AsPDF(
					responsePortfolioReport,
					`${fileName}_details.pdf`
				);
			}
		} catch (error) {
			// Hide previous toast if there's an error
			Toast.hide(toastId);

			// Show error toast
			Toast.show({
				type: "error",
				text1: "Download Failed!",
				text2:
					error instanceof Error
						? error.message
						: "Something went wrong.",
				position: "bottom",
				bottomOffset: 0,
				visibilityTime: 3000,
			});

			console.error("Error downloading portfolio report:", error);
		}
	};

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const responsePortfolioDetails: any =
					await getPortfolioDetails(paramsID);

				setPortfolioDetails(responsePortfolioDetails);
			} catch (error) {
				console.log("Error fetching portfolio details:", error);
			} finally {
				dispatch(inActiveLoading());
			}
		};

		if (paramsID?.PortfolioId) fetchDetails();
	}, [paramsID?.PortfolioId]);
	useEffect(() => {
		const fetchDeals = async () => {
			try {
				const responsePortfolioDeals: any =
					await getPortfolioDeals(paramsID);

				if (portfolioDetails?.message != "no data") {
					setPortfolioDeals(responsePortfolioDeals);
				}
			} catch (error) {
				console.log("Error fetching portfolio deals:", error);
			} finally {
				dispatch(inActiveLoading());
			}
		};
		if (modalVisible) fetchDeals();
	}, [modalVisible]);
	useEffect(() => {
		if (portfolioDetails && isChartLoaded) {
			if (portfolioDetails?.message === "no data") {
				updateEmptyChart(donutwebViewRef, donutIFrameRef, "donut");
				updateEmptyChart(areaWebViewRef, areaIFrameRef);
				return;
			}

			updateApexChart(
				"series",
				donutwebViewRef,
				donutIFrameRef,
				portfolioDetails?.donotChartData
			);
			updateApexChart(
				"series",
				areaWebViewRef,
				areaIFrameRef,
				portfolioDetails?.areaChartData
			);
			updateLocale();
		}
	}, [portfolioDetails, isChartLoaded]);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#C3C3C3"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{portfolioDetails?.closedData?.length === 0 ? (
				<View className="flex-1  bg-white">
					<PortFolioChartShimmer />
				</View>
			) : (
				<>
					<View style={{ flex: 1 }}>
						<View
							style={[
								{
									height: "100%",
								},
							]}
						>
							<View className="flex-1 bg-white">
								<View
									className={`flex flex-row justify-between`}
									style={{
										height:
											Platform.OS === "web"
												? screenHeight *
													0.25
												: screenHeight *
													0.23,
									}}
								>
									<ChartComponent
										webViewRef={donutwebViewRef}
										iFrameRef={donutIFrameRef}
										onMessage={onMessage}
										webViewhtmlContent={
											webviewDonutChartHtml
										}
										iFramehtmlContent={
											iFreameDonutChartHtml
										}
										showToggleOrientation={false}
										showToolbar={false}
										iFrameWidth="50%"
										setIsChartLoaded={
											setIsChartLoaded
										}
									/>

									<View
										className={`flex-col justify-start w-[35%] md:w-[10%]`}
									>
										<DataDisplay
											data={
												portfolioDetails
													?.closedData[0]
											}
											title={"Closed"}
											locale={locale}
										/>
										<DataDisplay
											data={
												portfolioDetails
													?.openData[0]
											}
											title={"Open"}
											locale={locale}
										/>
									</View>
									<View className="mr-10 ml-7 mt-3">
										<FontAwesome5
											name="file-download"
											size={35}
											color="#ef4444"
											onPress={
												exportPortfolioReport
											}
										/>
									</View>
								</View>
								<View className="h-1 bg-[#DEDEDE] mt-1" />
								<View
									className=""
									style={{
										height:
											Platform.OS === "web"
												? screenHeight *
													0.58
												: screenHeight *
													0.61,
										paddingTop:
											Platform.OS !== "web"
												? 15
												: undefined,
										padding: 3,
									}}
								>
									<ChartComponent
										webViewRef={areaWebViewRef}
										iFrameRef={areaIFrameRef}
										onMessage={onMessage}
										webViewhtmlContent={
											webviewAreaHtmlcontent
										}
										iFramehtmlContent={
											iframeAreahtlcontent
										}
										showToggleOrientation={false}
										showToggle={false}
										setIsChartLoaded={
											setIsChartLoaded
										}
									/>
								</View>
							</View>
						</View>

						<Modal
							animationType="slide"
							transparent={false}
							visible={modalVisible}
							onRequestClose={() =>
								setModalVisible(!modalVisible)
							}
						>
							<View
								className={`"h-full w-full absolute flex-1`}
								style={StyleSheet.absoluteFill}
							>
								<Transactions
									cards={portfolioDeals}
									setModalVisible={setModalVisible}
									modalVisible={modalVisible}
									title={paramsID?.PortfolioName}
								/>
							</View>
						</Modal>
					</View>
					<TouchableOpacity
						className={`bg-primary mb-2 bottom-0   py-2 mx-5 rounded-sm my-2 
								
									absolute  left-0 right-0 
								`}
						onPress={() => setModalVisible(!modalVisible)}
					>
						<Text className="text-white text-center text-base font-medium uppercase">
							{i18n.t("View_Deals")}
						</Text>
					</TouchableOpacity>
				</>
			)}
		</SafeAreaView>
	);
};

export default PortfolioOverView;
