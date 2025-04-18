import ChartComponent from "@/components/Chart/ChartComponent"
import { inActiveLoading } from "@/store/navigationSlice"
import React, { useEffect, useRef, useState } from "react"
import {
	View,
	Platform,
	SafeAreaView,
	Text,
	TouchableOpacity,
	StatusBar,
	Dimensions,
	StyleSheet,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesome5 } from "@expo/vector-icons"
import { i18n } from "@/localization/config"
import { useLocalSearchParams } from "expo-router"
import { RootState } from "@/store/store"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import { PortFolioChartShimmer } from "@/components/ChartShimmer"
import {
	getPortfolioDeals,
	getPortfolioDetails,
	getPortfolioReportBase64PDF,
} from "@/services/portfolio.service"
import Transactions, { DataDisplay } from "@/components/TranscationCard"
import { Modal } from "react-native"
import {
	updateApexChart,
	updateEmptyChart,
} from "@/components/Chart/chartUpdateFunctions"
import {
	exportBase64ToPDF,
	exportBase64ToPDFWeb,
} from "@/components/exportcsv/exportToFiles"
import Toast from "react-native-toast-message"
import { FormattedPortfolioDetails, TradeDetailsArray } from "@/types/type"
import useNetworkStatus from "@/hooks/useNetworkStatus"
import webviewAreaHtmlContent from "@/components/Chart/config/Areachart.android"
import iframeAreaHtmlContent from "@/components/Chart/config/Areachart.web"
import webviewDonutChartHtmlContent from "@/components/Chart/config/Donutchart.android"
import iframeDonutChartHtmlContent from "@/components/Chart/config/Donutchart.web"

const PortfolioOverView = () => {
	const dispatch = useDispatch()
	const isOnline = useNetworkStatus()
	const { id } = useLocalSearchParams()
	const locale = useSelector((state: RootState) => state.culture.locale)
	const donutwebViewRef = useRef<WebView | null>(null)
	const donutIFrameRef = useRef<HTMLIFrameElement | any>(null)
	const areaWebViewRef = useRef<WebView | null>(null)
	const areaIFrameRef = useRef<HTMLIFrameElement | any>(null)
	const paramsID = id ? JSON.parse(decodeURIComponent(id as string)) : {}
	const [modalVisible, setModalVisible] = useState(false)
	const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false)
	const [isDonutChartLoaded, setIsDonutChartLoaded] = useState<boolean>(false)
	const [portfolioDetails, setPortfolioDetails] =
		useState<FormattedPortfolioDetails>({
			areaChartData: [],
			donotChartData: [],
			closedData: [],
			openData: [],
			message: "",
		})
	const [portfolioDeals, setPortfolioDeals] = useState<TradeDetailsArray>([])
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
	const { height: screenHeight } = Dimensions.get("window")
	const onMessage = async (event: WebViewMessageEvent) => {
		const message = JSON.parse(event.nativeEvent.data)
		//console.log(message?.action);
	}
	const onRefresh = async () => {
		setIsRefreshing(true)
		const responsePortfolioDeals: any = await getPortfolioDeals(paramsID)
		setPortfolioDeals(responsePortfolioDeals)
		setIsRefreshing(false)
	}
	const updateLocale = () => {
		if (Platform.OS === "web") {
			const iframe = areaIFrameRef.current
			if (iframe && iframe?.contentWindow) {
				iframe?.contentWindow?.updateLocale?.(
					locale,
					`${new Date(paramsID?.PortfolioDate).getFullYear()}`
				)
			}
			if (
				donutIFrameRef?.current &&
				donutIFrameRef?.current?.contentWindow
			) {
				donutIFrameRef?.current?.contentWindow?.updateLocale?.(locale)
			}
		} else {
			if (areaWebViewRef?.current) {
				const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}', ${new Date(paramsID?.PortfolioDate).getFullYear()});}`

				areaWebViewRef.current.injectJavaScript(updateLocaleScript)
			}
			if (donutwebViewRef?.current) {
				let updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`
				donutwebViewRef?.current.injectJavaScript(updateLocaleScript)
			}
		}
	}

	const exportPortfolioReport = async () => {
		if (!isOnline || portfolioDetails?.message === "no data") return
		else {
			// Show initial toast indicating download is in progress
			const toastId = Toast.show({
				type: "download",
				text1: "File Downloading....",
				position: "bottom",
				bottomOffset: 0,
				autoHide: false, // Keeps the toast visible
				props: { spinner: true },
			})

			try {
				// Fetch the portfolio report
				const responsePortfolioReport =
					await getPortfolioReportBase64PDF(paramsID)

				// Hide the previous toast
				Toast.hide(toastId)
				// Save or share the file based on platform
				const fileName = paramsID.PortfolioName.replace(
					/[&\/\\#,+()$~%.'":*?<>{}]/g,
					""
				)

				if (Platform.OS === "web") {
					exportBase64ToPDFWeb(
						responsePortfolioReport,
						`${fileName}_details.pdf`
					)
				} else {
					exportBase64ToPDF(
						responsePortfolioReport,
						`${fileName}_details.pdf`
					)
				}
			} catch (error) {
				// Hide previous toast if there's an error
				Toast.hide(toastId)

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
				})

				console.error("Error downloading portfolio report:", error)
			}
		}
	}

	useEffect(() => {
		const fetchDetails = async () => {
			if (!isOnline) return
			else {
				try {
					const responsePortfolioDetails: any =
						await getPortfolioDetails(paramsID)

					setPortfolioDetails(responsePortfolioDetails)
				} catch (error) {
					console.log("Error fetching portfolio details:", error)
				} finally {
					dispatch(inActiveLoading())
				}
			}
		}

		if (paramsID?.PortfolioId) fetchDetails()
	}, [paramsID?.PortfolioId, isOnline])
	useEffect(() => {
		const fetchDeals = async () => {
			if (!isOnline) {
				return
			} else {
				try {
					if (portfolioDetails?.message != "no data") {
						const responsePortfolioDeals: any =
							await getPortfolioDeals(paramsID)
						setPortfolioDeals(responsePortfolioDeals)
					}
				} catch (error) {
					console.log("Error fetching portfolio deals:", error)
				} finally {
					dispatch(inActiveLoading())
				}
			}
		}
		if (modalVisible) fetchDeals()
	}, [modalVisible, isOnline])
	useEffect(() => {
		if (portfolioDetails && isChartLoaded) {
			if (portfolioDetails?.message === "no data") {
				updateEmptyChart(donutwebViewRef, donutIFrameRef, "donut")
				updateEmptyChart(areaWebViewRef, areaIFrameRef, "area")
				return
			}

			updateLocale()
			updateApexChart(
				"chart",
				donutwebViewRef,
				donutIFrameRef,
				portfolioDetails?.donotChartData,
				{
					title: {
						text: paramsID?.PortfolioName,
					},
				}
			)
			updateApexChart(
				"series",
				areaWebViewRef,
				areaIFrameRef,
				portfolioDetails?.areaChartData
			)
		}
	}, [isChartLoaded, isDonutChartLoaded])

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
							<View
								className={`flex flex-row justify-between `}
								style={{
									height:
										Platform.OS === "web"
											? screenHeight * 0.23
											: screenHeight * 0.23,
								}}
							>
								<ChartComponent
									webViewRef={donutwebViewRef}
									iFrameRef={donutIFrameRef}
									onMessage={onMessage}
									webViewhtmlContent={
										webviewDonutChartHtmlContent
									}
									iFramehtmlContent={
										iframeDonutChartHtmlContent
									}
									showToggleOrientation={false}
									showToolbar={false}
									iFrameWidth="50%"
									setIsChartLoaded={setIsDonutChartLoaded}
								/>

								<View
									className={`flex-col justify-start w-[33%] md:w-[10%]`}
								>
									<DataDisplay
										data={portfolioDetails?.closedData[0]}
										title={"Closed"}
										locale={locale}
									/>
									<DataDisplay
										data={portfolioDetails?.openData[0]}
										title={"Open"}
										locale={locale}
									/>
								</View>
								<View
									className="ml-7 mt-3 "
									style={{
										marginRight:
											Platform.OS === "web" ? "10%" : 20,
									}}
								>
									<FontAwesome5
										name="file-download"
										size={25}
										color="#ef4444"
										onPress={exportPortfolioReport}
									/>
								</View>
							</View>
							<View className="h-1 bg-[#DEDEDE] mt-1" />
							<View
								className=""
								style={{
									height:
										Platform.OS === "web"
											? screenHeight * 0.6
											: screenHeight * 0.61,
									paddingTop:
										Platform.OS !== "web" ? 15 : undefined,
									padding: 3,
								}}
							>
								<ChartComponent
									isChartEmpty={
										portfolioDetails?.message === "no data"
									}
									webViewRef={areaWebViewRef}
									iFrameRef={areaIFrameRef}
									onMessage={onMessage}
									webViewhtmlContent={webviewAreaHtmlContent}
									iFramehtmlContent={iframeAreaHtmlContent}
									showToggleOrientation={false}
									setIsChartLoaded={setIsChartLoaded}
								/>
							</View>
						</View>
						<Modal
							animationType="fade"
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
									onRefresh={onRefresh}
									isRefreshing={isRefreshing}
								/>
							</View>
						</Modal>
					</View>

					<TouchableOpacity
						className="bg-primary  bottom-0   mx-2 mb-2 py-3 rounded-sm  absolute  left-0 right-0 "
						onPress={() => setModalVisible(!modalVisible)}
					>
						<Text className="text-white text-center text-base font-medium uppercase">
							{i18n.t("View_Deals")}
						</Text>
					</TouchableOpacity>
				</>
			)}
		</SafeAreaView>
	)
}

export default PortfolioOverView
