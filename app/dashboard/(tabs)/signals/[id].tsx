import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { PricesItem, signalsCards } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import CustomSwitch from "@/components/CustomSwitch";
import { i18n } from "@/localization/localConfig";
import { RootState } from "@/store/store";
import { StatusBar } from "react-native";
import { fetchDataByToggle } from "@/services/auth.services";
import { st } from "@/utils/Styles";
import { ChartShimmer } from "@/components/ChartShimmer";
import SignalSettings from "@/components/SignalSettings";
const SignalDetails = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [isChartLoaded, setIsChartLoaded] = useState<any>(false);
	const { id } = useLocalSearchParams();
	const [signalDetail, setSignalDetails] = useState<any>([]);
	const [isEnabled, setIsEnabled] = useState(true);
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);

	useEffect(() => {
		const filteredItem = PricesItem.filter(
			(item: any) => item.id === Number(id)
		);
		setTimeout(() => {
			setSignalDetails(filteredItem[0]);
		}, 1000);
	}, [id]);

	const fetchChartData = async (tab: string) => {
		try {
			return fetchDataByToggle(tab);
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};
	useEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);
	// Request permissions on app start
	// useEffect(() => {
	// 	Notifications.requestPermissionsAsync();
	// }, []);

	// // Function to trigger notification after 5 seconds
	// const scheduleNotification = async () => {
	// 	await Notifications.scheduleNotificationAsync({
	// 		content: {
	// 			title: "Hello! 🚀",
	// 			body: "This is a test notification after 5 seconds.",
	// 		},
	// 		trigger: {
	// 			type: Notifications.SchedulableTriggerInputTypes
	// 				.TIME_INTERVAL,
	// 			seconds: 2,
	// 		},
	// 	});
	// };
	return (
		<SafeAreaView className="flex-1 bg-white ">
			<StatusBar
				barStyle="dark-content"
				backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{signalDetail <= 0 ? (
				<View className="flex-1  bg-white">
					<ChartShimmer />
				</View>
			) : (
				<>
					<View
						className={`flex-1 
					 "bg-white"
					`}
					>
						{/* Header Section */}
						{!isLandscape && (
							<View
								className="flex justify-between bg-white flex-row  m-1  h-20 px-3 pl-5  "
								style={[
									st.headerShadow,
									st.bottomShadow,
								]}
							>
								<View className="justify-center items-center">
									<Text className="text-xl font-medium text-mainCardHeaderText">
										{signalDetail?.title}
									</Text>
								</View>
								<View className="flex-row justify-center items-center">
									<Text className="  mr-2 text-md font-normal text-mainCardHeaderText ">
										Notification
									</Text>
									<CustomSwitch
										isEnabled={isEnabled}
										setIsEnabled={setIsEnabled}
									/>
								</View>
							</View>
						)}

						<View style={{ flex: 1 }}>
							<View
								style={{ height: "100%" }}
								className={`${
									!isLandscape &&
									"h-full w-full absolute bg-white"
								} `}
							>
								<ToggleChartComponent
									isSignaleScreen={true}
									fetchChartData={fetchChartData}
									isChartLoaded={isChartLoaded}
									setIsChartLoaded={setIsChartLoaded}
								/>
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
							<SignalSettings
								cards={signalsCards}
								setModalVisible={setModalVisible}
								modalVisible={modalVisible}
								signalDetail={signalDetail}
								isEnabled={isEnabled}
								setIsEnabled={setIsEnabled}
							/>
						</Modal>
					</View>
					{!isLandscape && (
						<TouchableOpacity
							className={`bg-[#e31836]  bottom-0  h-12 py-3 mx-5 rounded-sm my-2   
						`}
							onPress={() =>
								setModalVisible(!modalVisible)
							}
						>
							<Text className="text-white text-center text-base font-medium uppercase">
								{i18n.t("View_Signal_Settings")}
							</Text>
						</TouchableOpacity>
					)}
				</>
			)}
		</SafeAreaView>
	);
};

export default SignalDetails;
