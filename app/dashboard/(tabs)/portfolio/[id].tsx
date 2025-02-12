import ChartComponent from "@/components/Chart/ChartComponent";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
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
import { portfolioCards } from "@/constants/constantData";
import { useLocalSearchParams } from "expo-router";
import { RootState } from "@/store/store";
import WebView from "react-native-webview";
import { PortFolioChartShimmer } from "@/components/ChartShimmer";
import { getPortfolioDetails } from "@/services/portfolio.service";
import Transactions, { DataDisplay } from "@/components/TranscationCard";
import { Modal } from "react-native";
import {
	updateApexChart,
	updateEmptyChart,
} from "@/components/Chart/chartUpdateFunctions";

const PortfolioOverView = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [isChartLoaded, setIsChartLoaded] = useState<any>(false);
	const [closedData, setClosedData] = useState<any>([
		{
			Price: 0,
			Load: 0,
			Value: 0,
			PriceUnit: "€",
			LoadUnit: "MWh",
			unit: "€/MWh",
		},
	]);
	const [portfolioDetails, setPortfolioDetails] = useState<any>([]);
	const [openData, setOpenData] = useState<any>([
		{
			Price: 0,
			Load: 0,
			Value: 0,
			PriceUnit: "€",
			LoadUnit: "MWh",
			unit: "€/MWh",
		},
	]);
	const { height: screenHeight } = Dimensions.get("window");
	const locale = useSelector((state: RootState) => state.language.locale);
	const dispatch = useDispatch();
	const donutwebViewRef = useRef<WebView | null>(null);
	const donutIFrameRef = useRef<HTMLIFrameElement | any>(null);
	const areaWebViewRef = useRef<WebView | null>(null);
	const areaIFrameRef = useRef<HTMLIFrameElement | any>(null);
	const { id }: any = useLocalSearchParams();
	const paramsID = id ? JSON.parse(decodeURIComponent(id as string)) : {};
	const onMessage = async (event: any) => {
		const message = JSON.parse(event.nativeEvent.data);
	};

	const updateLocale = () => {
		if (Platform.OS === "web") {
			const iframe = areaIFrameRef.current;
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.updateLocale?.(
					locale,
					`Target ${paramsID?.year}`
				);
			}
		} else {
			if (areaWebViewRef?.current) {
				const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}', 'Target ${paramsID?.year}');}`;

				areaWebViewRef.current.injectJavaScript(updateLocaleScript);
			}
		}
		updateApexChart("options", donutwebViewRef, donutIFrameRef, {
			title: {
				text: paramsID?.name,
			},
		});
	};

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const response: any = await getPortfolioDetails(
					Number(paramsID?.PortfolioID)
				);
				setPortfolioDetails(response);
				setClosedData(response?.closedData);
				setOpenData(response?.openData);
			} catch (error) {
				console.log("Error fetching portfolio details:", error);
			} finally {
				dispatch(inActiveLoading()); // Ensure loading state updates after request
			}
		};

		if (paramsID?.PortfolioID) fetchDetails();
	}, [paramsID?.PortfolioID]);

	useEffect(() => {
		if (portfolioDetails) {
			if (portfolioDetails?.message === "no data") {
				updateEmptyChart(donutwebViewRef, donutIFrameRef, "donut");
				updateEmptyChart(areaWebViewRef, areaIFrameRef);
				return;
			}
			updateLocale();

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
			{portfolioDetails.length === 0 ? (
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
											data={closedData[0]}
											title={"Closed"}
										/>
										<DataDisplay
											data={openData[0]}
											title={"Open"}
										/>
									</View>
									<View className="mr-10 ml-7 mt-3">
										<FontAwesome5
											name="file-download"
											size={35}
											color="#ef4444"
											onPress={() => {}}
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
							transparent={true}
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
									cards={portfolioCards}
									setModalVisible={setModalVisible}
									modalVisible={modalVisible}
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
