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
import SignalSettings, {
	SignalsTitleNotificationCard,
} from "@/components/SignalSettings";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import PrimaryButton from "@/components/ui/PrimaryButton";
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
			return [];
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};
	useEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	return (
		<SafeAreaView
			className="flex-1 bg-white "
			style={{
				marginBottom: insets.bottom,
			}}
		>
			{/* Header Section */}
			{!isLandscape && (
				<SignalsTitleNotificationCard
					title={signalDetail?.title}
					isEnabled={isEnabled}
					setIsEnabled={setIsEnabled}
				/>
			)}

			<View style={{ flex: 1 }}>
				<View
					style={{ height: "100%" }}
					className={`${
						!isLandscape && "h-full w-full absolute bg-white"
					} `}
				>
					<ToggleChartComponent
						screenName="signals"
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

			{!isLandscape && (
				<PrimaryButton
					title={"View_Signal_Settings"}
					onPress={() => setModalVisible(!modalVisible)}
				/>
			)}
		</SafeAreaView>
	);
};

export default SignalDetails;
