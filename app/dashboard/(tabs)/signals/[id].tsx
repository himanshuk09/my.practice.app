import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Modal,
} from "react-native";
import { st } from "@/utils/Styles";
import { i18n } from "@/localization/config";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import CustomSwitch from "@/components/CustomSwitch";
import { useDispatch, useSelector } from "react-redux";
import SignalSettings from "@/components/SignalSettings";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { fetchDataByToggle } from "@/services/auth.service";
import { PricesItem, signalsCards } from "@/constants/constantData";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignalDetails = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const { id } = useLocalSearchParams();
	const [isEnabled, setIsEnabled] = useState<boolean>(true);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [signalDetail, setSignalDetails] = useState<any>([]);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const insets = useSafeAreaInsets();
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
		if (isFocused) {
			setTimeout(() => {
				dispatch(inActiveLoading());
			}, 500);
		}
	}, [isFocused]);

	return (
		<SafeAreaView
			className="flex-1 bg-white "
			style={{
				marginBottom: insets.bottom,
			}}
		>
			<View
				className="flex-1 
					 bg-white"
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
								{i18n.t("notifications")}
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
							!isLandscape && "h-full w-full absolute bg-white"
						} `}
					>
						<ToggleChartComponent
							isSignaleScreen={true}
							fetchChartData={fetchChartData}
						/>
					</View>
				</View>

				<Modal
					animationType="slide"
					transparent={false}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(!modalVisible)}
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
					onPress={() => setModalVisible(!modalVisible)}
				>
					<Text className="text-white text-center text-base font-medium uppercase">
						{i18n.t("View_Signal_Settings")}
					</Text>
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
};

export default SignalDetails;
