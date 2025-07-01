import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Image,
	Platform,
} from "react-native";
import { st } from "@/utils/Styles";
import { useRouter } from "expo-router";
import { ROUTEKEYS } from "@/utils/messages";
import { useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FooterActions from "@/components/ui/FooterActions";

const PricesSettings = () => {
	const [selectedPlace, setSelectedPlace] = useState();
	const [selectedEnergyType, setSelectedEnergyType] = useState("Power");
	const [selectedProductType, setSelectedProductType] = useState("Futures");
	const router = useRouter();
	const isFocused = useIsFocused();
	const dispatch = useDispatch();
	const energyTypes = ["Power", "H GAS", "Coal", "Hydrogen"];
	const allProductTypes: any = {
		Power: ["Futures", "Spot Auction"],
		"H GAS": ["Futures", "Spot Continous"],
		Coal: ["Futures"],
		Hydrogen: ["Spot Auction"],
	};
	const insets = useSafeAreaInsets();
	const renderButtons = (
		options: string[],
		selectedValue: string,
		setSelectedValue: React.Dispatch<React.SetStateAction<string>>
	) => {
		return options.map((option) => (
			<TouchableOpacity
				key={option}
				className={`flex  px-2 justify-start items-center flex-row  mx-1 rounded-sm ${
					selectedValue === option
						? "bg-white border-[1px] border-primary min-w-24"
						: "bg-dropdownBg border-none"
				}`}
				onPress={() => setSelectedValue(option)}
			>
				<Text
					className={`w-fit my-3 text-dropdownInactiveText  text-md font-normal mr-2 ${
						selectedValue === option &&
						"text-dropdownActiveText font-bold"
					}`}
				>
					{option}
				</Text>
				{selectedValue === option && (
					<Image
						source={require("@/assets/images/tickMark.png")}
						style={{
							position: "absolute",
							top: 1,
							right: 1,
							marginLeft: 1,
							height: 15,
							width: 15,
						}}
					/>
				)}
			</TouchableOpacity>
		));
	};
	const renderProductButtons = (
		options: string[],
		selectedValue: string,
		setSelectedValue: React.Dispatch<React.SetStateAction<string>>
	) => {
		return options.map((option) => (
			<TouchableOpacity
				key={option}
				className={`flex  px-2 justify-start items-center flex-row w-[40%] mx-1 rounded-sm ${
					selectedValue === option
						? "bg-[#fff] border-[1px] border-primary min-w-24"
						: "bg-[#d6d6d6] border-none"
				}`}
				onPress={() => setSelectedValue(option)}
			>
				<Text
					className={`w-fit my-3 text-md font-normal mr-2 ${
						selectedValue === option && "text-gray-900 font-bold"
					}`}
				>
					{option}
				</Text>
				{selectedValue === option && (
					<Image
						source={require("@/assets/images/tickMark.png")}
						style={{
							position: "absolute",
							top: 1,
							right: 1,
							marginLeft: 1,
							height: 15,
							width: 15,
						}}
					/>
				)}
			</TouchableOpacity>
		));
	};
	const filteredProductTypes: any = allProductTypes[selectedEnergyType];
	const filteredEnergyTypes =
		selectedPlace === "HUPX" ? ["Power"] : energyTypes;

	useEffect(() => {
		if (filteredEnergyTypes?.length === 1) {
			setSelectedEnergyType(filteredEnergyTypes[0]);
		}
	}, [filteredEnergyTypes]);

	useEffect(() => {
		if (filteredProductTypes?.length === 1) {
			setSelectedProductType(filteredProductTypes[0]);
		}
	}, [filteredProductTypes]);

	useEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);
	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{
				marginBottom: insets.bottom,
			}}
		>
			{/* Market Place Section */}
			<View
				className="p-2 mb-1 py-3 w-full bg-white "
				style={st.boxShadow}
			>
				<Text className="text-lg font-bold ml-3 capitalize text-dropdownSecondTitle mb-1">
					Market Place
				</Text>
				<Picker
					selectedValue={selectedPlace}
					onValueChange={(newValue) => setSelectedPlace(newValue)}
					className="w-full p-3 border-b-2 bg-transparent rounded-sm"
					mode="dropdown"
					{...(Platform.OS !== "web" && {
						dropdownIconColor: "#000",
						dropdownIconRippleColor: "#c1c1c1",
					})}
				>
					<Picker.Item
						label="EEX"
						value="EEX"
						style={{
							color: "#0f172a",
							fontSize: 15,
							fontWeight: "900",
							paddingLeft: 20,
							backgroundColor: "white",
						}}
					/>
					<Picker.Item
						label="HUPX"
						value="HUPX"
						style={{
							color: "#0f172a",
							fontSize: 15,
							fontWeight: "900",
							paddingLeft: 20,
							backgroundColor: "white",
						}}
					/>
				</Picker>
			</View>

			{/* Energy Type Section */}
			<View className="p-2 mx-1 py-3 w-full mb-3 mt-1 bg-dropdownCardBg ">
				<Text className="text-lg font-bold ml-3 capitalize text-dropdownSecondTitle mb-1">
					Energy Type
				</Text>
				<View className="flex-row flex-wrap gap-1 mx-2 mt-5 mb-7 ">
					{renderButtons(
						filteredEnergyTypes,
						selectedEnergyType,
						setSelectedEnergyType
					)}
				</View>
			</View>

			{/* Product Type Section */}
			<View className="p-2 mx-1 py-3 w-full mb-3 bg-dropdownCardBg ">
				<Text className="text-lg font-bold ml-3 capitalize text-dropdownSecondTitle mb-1">
					Product Type
				</Text>
				<View className="flex-row flex-wrap gap-1 mx-2 mt-5 mb-7">
					{renderProductButtons(
						filteredProductTypes,
						selectedProductType,
						setSelectedProductType
					)}
				</View>
			</View>

			<FooterActions
				leftTitle="cancel"
				leftOnPress={() => router.replace(ROUTEKEYS.DASHBOARD)}
				rightTitle="save"
				rightOnPress={() => router.replace(ROUTEKEYS.DASHBOARD)}
			/>
		</SafeAreaView>
	);
};

export default PricesSettings;
