import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	Modal,
	Pressable,
	TextInput,
	TouchableOpacity,
	Keyboard,
	Animated,
	Easing,
	Platform,
	StyleSheet,
} from "react-native";
import DateTimePickerComponents from "./DateTimePickerComponents";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { i18n } from "@/localization/localConfig";
import { DateType } from "react-native-ui-datepicker";
type initialViewProps = "day" | "month" | "year" | "time";
interface PickerModelProps {
	showRangePicker?: boolean;
	showPeriodOfTime?: boolean;
	showValueRange?: boolean;
	modalVisible?: boolean;
	setModalVisible?: any;
	selectedStartDate?: any;
	setSelectedStartDate?: React.Dispatch<React.SetStateAction<any>>;
	selectedEndDate?: any;
	setSelectedEndDate?: React.Dispatch<React.SetStateAction<any>>;
	handleRangeDataFilter?: any;
}
const PickerModel = ({
	showRangePicker = true,
	showPeriodOfTime = true,
	showValueRange = true,
	modalVisible,
	setModalVisible,
	selectedStartDate,
	setSelectedStartDate,
	selectedEndDate,
	setSelectedEndDate,
	handleRangeDataFilter,
}: PickerModelProps) => {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [pickerInitialView, setPickerInitaialView] =
		useState<initialViewProps>("day");
	const [rangeDate, setRangeDate] = React.useState<{
		startDate: DateType;
		endDate: DateType;
	}>({ startDate: dayjs().subtract(1, "month"), endDate: dayjs() });
	const [openStartDate, setOpenStartDate] = useState(false);
	const [openEndDate, setOpenEndDate] = useState(false);
	const [openRangeDataPicker, setOpenRangeDatePicker] = useState(false);
	const { locale } = useSelector((state: RootState) => state.language);
	const [value, setValue] = useState<any>();
	const animationHeight = useRef(new Animated.Value(0)).current;

	// Monitor keyboard visibility
	useEffect(() => {
		const keyboardShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => setKeyboardVisible(true)
		);
		const keyboardHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => setKeyboardVisible(false)
		);

		return () => {
			keyboardShowListener.remove();
			keyboardHideListener.remove();
		};
	}, []);

	// Animate height based on keyboard visibility
	useEffect(() => {
		Animated.timing(animationHeight, {
			toValue: isKeyboardVisible
				? 0
				: Platform.OS === "web"
					? 210
					: 200, // Collapse on keyboard open, expand otherwise
			duration: 200,
			easing: Easing.inOut(Easing.cubic),
			useNativeDriver: false, // Native driver doesn't support height animation
		}).start();
	}, [isKeyboardVisible]);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}
		>
			<Pressable
				onPress={() => {
					setModalVisible(false);
					setOpenStartDate(false);
					setOpenEndDate(false);
					setOpenRangeDatePicker(false);
				}}
				style={StyleSheet.absoluteFill}
			>
				<View
					className={`flex-1  pt-20 bg-[#0a0a0aa8] bg-opacity-50 ${Platform.OS === "web" && "justify-center items-center"}`}
				>
					<View
						className={`bg-white mx-2 ${Platform.OS === "web" && "w-80"}`}
					>
						{/* Period of Time */}
						{showPeriodOfTime && showRangePicker ? (
							<>
								<View className="flex-row justify-between pl-5 p-3 bg-[#ebebeb]">
									<Text className="text-chartText font-bold text-lg ">
										{i18n.t("Period_of_Time")}
									</Text>
									<TouchableOpacity
										className="m-1"
										onPress={() =>
											setModalVisible(
												!modalVisible
											)
										}
									>
										<AntDesign
											name="close"
											className="font-bold"
											size={23}
											color="#E63757"
										/>
									</TouchableOpacity>
								</View>

								<View className="flex-row justify-between items-center m-5 ">
									<View className="flex-1 mr-2">
										<Text className=" text-chartText  mb-1 font-semibold">
											{i18n.t("From")}
										</Text>
										<Pressable
											className=" bg-cardBg w-[50%]  px-2 py-3 flex-row justify-between"
											onPress={() =>
												setOpenRangeDatePicker(
													!openRangeDataPicker
												)
											}
										>
											<Text className="text-slate-600">
												{rangeDate.startDate
													? dayjs(
															rangeDate.startDate
														)
															.locale(
																locale
															)
															.format(
																locale ===
																	"en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)
													: dayjs()
															.locale(
																locale
															)
															.format(
																locale ===
																	"en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)}
											</Text>
											<FontAwesome
												name="calendar"
												size={18}
												color="#808080"
											/>
										</Pressable>
									</View>
									{/* <View className="flex-1 ml-2">
										<Text className="text-gray-400 mb-1">
											{" "}
											{""}
										</Text>
										<Pressable className=" bg-disableCard  px-2 py-3 flex-row justify-between">
											<Text className="text-[#616161]">
												00:00
											</Text>
											<Ionicons
												name="alarm-outline"
												size={20}
												color="#696969"
											/>
										</Pressable>
									</View> */}
								</View>

								<View className="flex-row justify-between items-center m-5">
									<View className="flex-1 mr-2">
										<Text className="text-chartText mb-1">
											{i18n.t("To")}
										</Text>
										<Pressable
											className=" bg-cardBg w-[50%] px-2 py-3 flex-row justify-between"
											onPress={() =>
												setOpenRangeDatePicker(
													!openRangeDataPicker
												)
											}
										>
											<Text className="text-slate-600">
												{rangeDate.endDate
													? dayjs(
															rangeDate.endDate
														)
															.locale(
																locale
															)
															.format(
																locale ===
																	"en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)
													: dayjs()
															.locale(
																locale
															)
															.format(
																locale ===
																	"en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)}
											</Text>
											<FontAwesome
												name="calendar"
												size={18}
												color="#808080"
											/>
										</Pressable>
									</View>
									{/* <View className="flex-1 ml-2 ">
										<Text className="text-gray-400 mb-1">
											{" "}
											{""}
										</Text>
										<Pressable className="bg-disableCard  px-2 py-3 flex-row justify-between">
											<Text className="text-[#616161]">
												00:00
											</Text>
											<Ionicons
												name="alarm-outline"
												size={20}
												color="#696969"
											/>
										</Pressable>
									</View> */}
								</View>
							</>
						) : (
							<>
								<View className="flex-row justify-between p-3 bg-[#ebebeb] pl-5">
									<Text
										className="text-chartText font-bold text-lg "
										onPress={() => {
											setKeyboardVisible(
												false
											);
											Keyboard.dismiss();
										}}
									>
										{i18n.t("Period_of_Time")}
									</Text>
									<TouchableOpacity
										className="m-1"
										onPress={() =>
											setModalVisible(
												!modalVisible
											)
										}
									>
										<AntDesign
											name="close"
											className="font-bold"
											size={23}
											color="#E63757"
										/>
									</TouchableOpacity>
								</View>
								<Animated.View
									style={{
										overflow: "hidden",
										height: animationHeight, // Controlled by animation
										// marginBottom: 5,
									}}
								>
									<View className="flex-row justify-between items-center m-5">
										<View className="flex-1 mr-2">
											<Text className=" text-chartText  mb-1 font-semibold">
												{i18n.t("From")}
											</Text>
											<Pressable
												className=" bg-cardBg  p-3 flex-row justify-between"
												onPress={() => {
													setOpenStartDate(
														!openStartDate
													);
													setPickerInitaialView(
														"day"
													);
												}}
											>
												<Text className="text-slate-700">
													{selectedStartDate
														? dayjs(
																selectedStartDate
															)
																.locale(
																	locale
																)
																.format(
																	locale ===
																		"en"
																		? "DD/MM/YYYY"
																		: "DD.MM.YYYY"
																)
														: dayjs()
																.locale(
																	locale
																)
																.format(
																	locale ===
																		"en"
																		? "DD/MM/YYYY"
																		: "DD.MM.YYYY"
																)}
												</Text>
												<FontAwesome
													name="calendar"
													size={18}
													color="#808080"
												/>
											</Pressable>
										</View>
										<View className="flex-1 ml-2">
											<Text className="text-gray-400 mb-1">
												{" "}
												{""}
											</Text>
											<Pressable
												className="bg-cardBg  p-3 flex-row justify-between"
												onPress={() => {
													setOpenStartDate(
														!openStartDate
													);
													setPickerInitaialView(
														"time"
													);
												}}
											>
												<Text className="text-slate-700">
													{selectedStartDate
														? dayjs(
																selectedStartDate
															)
																.locale(
																	"en"
																)
																.format(
																	"HH:mm"
																)
														: dayjs()
																.locale(
																	"en"
																)
																.format(
																	"HH:mm"
																)}
												</Text>
												<Ionicons
													name="alarm"
													size={20}
													color="#808080"
												/>
											</Pressable>
										</View>
									</View>
									<View className="flex-row justify-between items-center m-5">
										<View className="flex-1 mr-2">
											<Text className=" text-chartText  mb-1 font-semibold">
												{i18n.t("To")}
											</Text>
											<Pressable
												className="bg-cardBg  p-3 flex-row justify-between"
												onPress={() => {
													setOpenEndDate(
														!openEndDate
													);
													setPickerInitaialView(
														"day"
													);
												}}
											>
												<Text className="text-slate-700">
													{selectedEndDate
														? dayjs(
																selectedEndDate
															)
																.locale(
																	locale
																)
																.format(
																	locale ===
																		"en"
																		? "DD/MM/YYYY"
																		: "DD.MM.YYYY"
																)
														: dayjs()
																.locale(
																	locale
																)
																.format(
																	locale ===
																		"en"
																		? "DD/MM/YYYY"
																		: "DD.MM.YYYY"
																)}
												</Text>
												<FontAwesome
													name="calendar"
													size={18}
													color="#808080"
												/>
											</Pressable>
										</View>
										<View className="flex-1 ml-2">
											<Text className="text-gray-400 mb-1">
												{""}{" "}
											</Text>
											<Pressable
												className="bg-cardBg  p-3 flex-row justify-between"
												onPress={() => {
													setOpenStartDate(
														!openStartDate
													);
													setPickerInitaialView(
														"time"
													);
												}}
											>
												<Text className="text-slate-700">
													{selectedEndDate
														? dayjs(
																selectedEndDate
															)
																.locale(
																	"en"
																)
																.format(
																	"HH:mm"
																)
														: dayjs()
																.locale(
																	"en"
																)
																.format(
																	"HH:mm"
																)}
												</Text>

												<Ionicons
													name="alarm"
													size={20}
													color="#808080"
												/>
											</Pressable>
										</View>
									</View>
								</Animated.View>
							</>
						)}

						{/* Value Range */}
						{showValueRange && (
							<View>
								<Text className="text-chartText font-bold text-lg p-3 pl-5 bg-[#ebebeb]">
									{i18n.t("Value_Range")}
								</Text>
								<View className="flex-col  m-4">
									<View className="mx-2 mb-2 w-[50%] ">
										<Text className=" text-chartText   mb-1 font-semibold">
											{i18n.t("From")}
										</Text>

										<View>
											<TextInput
												className=" bg-cardBg text-slate-700 p-3"
												placeholder="0,00"
												placeholderTextColor="#9a9b9f"
												value={value}
												onChangeText={(
													text
												) => {
													setValue(text);
												}}
												keyboardType="number-pad"
												onBlur={() => {}}
											/>
											<Text className="z-50 w-10 absolute top-3 right-2 font-bold size-6 text-chartText ">
												kWh
											</Text>
										</View>
									</View>
									<View className="mx-2 mb-2 w-[50%]">
										<Text className=" text-chartText  mb-1 font-semibold">
											{i18n.t("To")}
										</Text>
										<View>
											<TextInput
												className=" bg-cardBg text-slate-700 p-3"
												placeholder="0,00"
												placeholderTextColor="#9a9b9f"
												value={value}
												onChangeText={(
													text
												) => {
													setValue(text);
												}}
												keyboardType="number-pad"
												onBlur={() => {}}
											/>
											<Text className="z-50 w-10 absolute top-3 right-2 font-bold size-6 text-chartText ">
												kWh
											</Text>
										</View>
									</View>
								</View>
							</View>
						)}
						<View className="flex-row justify-end my-3">
							<Pressable
								className="px-4 py-2"
								onPress={() => setModalVisible(false)}
							>
								<Text className="text-chartText  font-medium text-base">
									{i18n.t("Cancel")}
								</Text>
							</Pressable>
							<Pressable
								className="px-4 py-2 mr-4"
								onPress={() => {
									handleRangeDataFilter();
									setTimeout(() => {
										setModalVisible(false);
									}, 100);
								}}
							>
								<Text className="text-red-600 font-medium text-base ">
									{i18n.t("OK")}
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Pressable>
			{openStartDate && (
				<Pressable
					className="absolute z-50 inset-0 flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8] "
					onPress={() => setOpenStartDate(false)}
				>
					<DateTimePickerComponents
						title="Select_Start_Date"
						open={openStartDate}
						timePicker={true}
						setOpen={setOpenStartDate}
						setSingleDate={setSelectedStartDate}
						defaultDate={selectedStartDate}
						initialView={pickerInitialView}
					/>
				</Pressable>
			)}
			{openEndDate && (
				<Pressable
					className="absolute z-50 inset-0 flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8] "
					onPress={() => setOpenEndDate(false)}
				>
					<DateTimePickerComponents
						title="Select_End_Date"
						open={openEndDate}
						timePicker={true}
						setOpen={setOpenEndDate}
						setSingleDate={setSelectedEndDate}
						defaultDate={selectedEndDate}
						initialView={pickerInitialView}
					/>
				</Pressable>
			)}
			{openRangeDataPicker && (
				<Pressable
					className="absolute z-50 inset-0 top-30 flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8]"
					onPress={() => setOpenRangeDatePicker(false)}
				>
					<DateTimePickerComponents
						title="Select_Date_Range"
						pickerMode="range"
						open={openRangeDataPicker}
						timePicker={false}
						rangeDate={rangeDate}
						setRangeDate={setRangeDate}
						setOpen={setOpenRangeDatePicker}
						setSelectedStartDate={setSelectedStartDate}
						setSelectedEndDate={setSelectedEndDate}
					/>
				</Pressable>
			)}
		</Modal>
	);
};
export default PickerModel;
