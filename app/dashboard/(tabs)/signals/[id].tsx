import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Animated,
	Easing,
	FlatList,
	Platform,
	StyleSheet,
	Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import StackHeader from "@/components/StackHeader";
import { ChartLoaderPNG } from "@/components/Loader";

const Card = ({ title, data }: any) => {
	return (
		<View
			className="bg-[#ebebeb] rounded-lg p-3 my-1 "
			style={st.boxShadow}
		>
			<Text className="text-sm text-gray-800 font-normal mb-2">
				{title}
			</Text>
			<View className="space-y-2 flex-row justify-between">
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between">
						<Text className=" text-sm text-gray-600">
							{i18n.t("Low_Soft")}:
						</Text>
						<Text className="text-gray-500">
							{data.lowSoft}
						</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("Low_Hard")}
						</Text>
						<Text className="text-gray-500">
							{data.lowHard}
						</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("Negative")}:
						</Text>
						<Text className="text-gray-500">
							{i18n.t(data.negative)}
						</Text>
					</View>
				</View>
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("High_Soft")}:
						</Text>
						<Text className="text-gray-500">
							{data.highSoft}
						</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("High_Hard")}:
						</Text>
						<Text className="text-gray-500">
							{data.highHard}
						</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("Days")}:
						</Text>
						<Text className="text-gray-500">{data.days}</Text>
					</View>
				</View>
			</View>
		</View>
	);
};
const SignalSettings = ({
	cards,
	setModalVisible,
	modalVisible,
	signalDetail,
	isEnabled,
	setIsEnabled,
}: any) => {
	const [loading, setLoadig] = useState<any>(true);

	useEffect(() => {
		setTimeout(() => {
			setLoadig(false);
		}, 1000);
	}, []);
	return (
		<View
			className={`"h-full w-full absolute flex-1 bg-white `}
			style={StyleSheet.absoluteFill}
		>
			<StackHeader
				title={"Signals_Details"}
				closed={true}
				setModalVisible={setModalVisible}
			/>
			<View
				className="flex justify-between bg-white flex-row  m-1  h-20 px-3 pl-5  "
				style={[st.headerShadow, st.bottomShadow]}
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
			<View className="w-full h-full flex-1">
				{cards?.length === 0 ? (
					<View className="items-center  bg-gray-100 overflow-scroll  p-2 justify-center h-full w-full">
						<Text>Data Not Available</Text>
					</View>
				) : loading ? (
					<ChartLoaderPNG />
				) : (
					<FlatList
						data={cards}
						renderItem={({ item, index }) => (
							<Card
								key={index}
								title={item.title}
								data={item.data}
							/>
						)}
						keyExtractor={(item: any, index) =>
							index.toString()
						}
						scrollEnabled={true}
						className="bg-slate-50 overflow-scroll  p-2"
						contentContainerStyle={{ paddingTop: 4 }}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						initialNumToRender={0}
						maxToRenderPerBatch={5}
					/>
				)}
			</View>
			<TouchableOpacity
				className={`bg-[#e31836]  bottom-0  h-12 py-3 mx-5 rounded-sm my-2 absolute  left-0 right-0 `}
				onPress={() => setModalVisible(!modalVisible)}
			>
				<Text className="text-white text-center text-base font-medium uppercase">
					{i18n.t("View_Signal_Chart")}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

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
				<View
					className={`flex-1 
					 "bg-white"
					`}
				>
					{/* Header Section */}
					{!isLandscape && (
						<View
							className="flex justify-between bg-white flex-row  m-1  h-20 px-3 pl-5  "
							style={[st.headerShadow, st.bottomShadow]}
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
			)}
		</SafeAreaView>
	);
};

export default SignalDetails;
