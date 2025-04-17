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
} from "react-native";
import DateTimePickerComponents from "./DateTimePickerComponents";
import dayjs, { Dayjs } from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { i18n } from "@/localization/config";
import { DateType } from "react-native-ui-datepicker";
type initialViewProps = "day" | "month" | "year" | "time";
interface PickerModelProps {
	maxMinValues?: any;
	setMaxMinValues?: any;
	showRangePicker?: boolean;
	showValueRange?: boolean;
	modalVisible?: boolean;
	setModalVisible?: any;
	selectedStartDate?: any;
	setSelectedStartDate?: React.Dispatch<
		React.SetStateAction<Dayjs | DateType | any>
	>;
	selectedEndDate?: any;
	setSelectedEndDate?: React.Dispatch<
		React.SetStateAction<Dayjs | DateType | any>
	>;
	handleRangeDataFilter?: any;
}
const PickerModel = ({
	maxMinValues,
	setMaxMinValues,
	showRangePicker = true,
	showValueRange = true,
	modalVisible,
	setModalVisible,
	selectedStartDate,
	setSelectedStartDate,
	selectedEndDate,
	setSelectedEndDate,
	handleRangeDataFilter,
}: PickerModelProps) => {
	const { locale } = useSelector((state: RootState) => state.culture);
	const animationHeight = useRef(new Animated.Value(0)).current;
	const [isKeyboardVisible, setKeyboardVisible] = useState<Boolean>(false);
	const [pickerInitialView, setPickerInitaialView] =
		useState<initialViewProps>("day");
	const [rangeDate, setRangeDate] = React.useState<{
		startDate: DateType;
		endDate: DateType;
	}>({ startDate: dayjs().subtract(1, "month"), endDate: dayjs() });
	const [openStartDate, setOpenStartDate] = useState<Boolean>(false);
	const [openEndDate, setOpenEndDate] = useState<Boolean>(false);
	const [openRangeDataPicker, setOpenRangeDatePicker] =
		useState<Boolean>(false);
	const [dateError, setDateError] = useState<boolean>(false);
	const [minMaxError, setMinMaxError] = useState<boolean>(false);

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
			toValue: isKeyboardVisible ? 0 : Platform.OS === "web" ? 210 : 157, // Collapse on keyboard open, expand otherwise
			duration: 200,
			easing: Easing.inOut(Easing.linear),
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
			<View
				className={`flex-1  pt-20 bg-[#0a0a0aa8] bg-opacity-50 ${Platform.OS === "web" && "justify-center items-center"}`}
			>
				<View
					className={`bg-white mx-3 ${Platform.OS === "web" && "w-80"}`}
				>
					{/* Period of Time */}
					{showRangePicker ? (
						<View>
							<View className="flex-row justify-between pl-5 p-3 bg-[#ebebeb]">
								<Text className="text-chartText font-bold text-lg ">
									{i18n.t("Period_of_Time")}
								</Text>
								<TouchableOpacity
									className="m-1"
									onPress={() =>
										setModalVisible(!modalVisible)
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
							<View className="p-5">
								<View className="flex-row justify-between items-center mb-2">
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
													? dayjs(rangeDate.startDate)
															.locale(locale)
															.format(
																locale === "en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)
													: dayjs()
															.locale(locale)
															.format(
																locale === "en"
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
								</View>
								<View className="flex-row justify-between items-center ">
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
													? dayjs(rangeDate.endDate)
															.locale(locale)
															.format(
																locale === "en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)
													: dayjs()
															.locale(locale)
															.format(
																locale === "en"
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
								</View>
							</View>
						</View>
					) : (
						<>
							{/* date time picker */}
							<View className="flex-row justify-between p-3 bg-[#ebebeb] pl-5">
								<Text
									className="text-chartText font-bold text-lg "
									onPress={() => {
										setKeyboardVisible(false);
										Keyboard.dismiss();
									}}
								>
									{i18n.t("Period_of_Time")}
								</Text>
								<TouchableOpacity
									className="m-1"
									onPress={() =>
										setModalVisible(!modalVisible)
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
								className="mx-4 "
							>
								<View className="flex-row justify-between items-center m-2">
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
												setPickerInitaialView("day");
											}}
										>
											<Text className="text-slate-700">
												{selectedStartDate
													? dayjs(selectedStartDate)
															.locale(locale)
															.format(
																locale === "en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)
													: dayjs()
															.locale(locale)
															.format(
																locale === "en"
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
												setPickerInitaialView("time");
											}}
										>
											<Text className="text-slate-700">
												{selectedStartDate
													? dayjs(selectedStartDate)
															.locale("en")
															.format("HH:mm")
													: dayjs()
															.locale("en")
															.format("HH:mm")}
											</Text>
											<Ionicons
												name="alarm"
												size={20}
												color="#808080"
											/>
										</Pressable>
									</View>
								</View>
								<View className="flex-row justify-between items-center mx-2 ">
									<View className="flex-1 mr-2">
										<Text className=" text-chartText  mb-1 font-semibold">
											{i18n.t("To")}
										</Text>
										<Pressable
											className="bg-cardBg  p-3 flex-row justify-between"
											onPress={() => {
												setOpenEndDate(!openEndDate);
												setPickerInitaialView("day");
											}}
										>
											<Text className="text-slate-700">
												{selectedEndDate
													? dayjs(selectedEndDate)
															.locale(locale)
															.format(
																locale === "en"
																	? "DD/MM/YYYY"
																	: "DD.MM.YYYY"
															)
													: dayjs()
															.locale(locale)
															.format(
																locale === "en"
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
												setPickerInitaialView("time");
											}}
										>
											<Text className="text-slate-700">
												{selectedEndDate
													? dayjs(selectedEndDate)
															.locale("en")
															.format("HH:mm")
													: dayjs()
															.locale("en")
															.format("HH:mm")}
											</Text>

											<Ionicons
												name="alarm"
												size={20}
												color="#808080"
											/>
										</Pressable>
									</View>
								</View>

								{dateError && (
									<View className="mx-2 ">
										<Text className="text-sm text-red-600">
											The end date must be later than
											start date.
										</Text>
									</View>
								)}
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
											style={{
												height: 40,
												padding: 10,
											}}
											keyboardType="numeric"
											value={maxMinValues.minY.toString()}
											onChangeText={(newText) => {
												const isGerman =
													locale === "de";

												// Allow digits, and either a comma (German) or dot (English)
												const allowedPattern = isGerman
													? /^[0-9]*[,]?[0-9]*$/
													: /^[0-9]*[.]?[0-9]*$/;

												if (
													allowedPattern.test(newText)
												) {
													setMaxMinValues(
														(prev: any) => ({
															...prev,
															minY: newText,
														})
													);
												}
											}}
											//onBlur={handleBlur}
											placeholderTextColor="#9a9b9f"
											placeholder={
												locale === "de"
													? "00,00"
													: "00.00"
											}
											maxLength={10}
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
											style={{
												height: 40,
												padding: 10,
											}}
											keyboardType="numeric"
											value={maxMinValues.maxY.toString()}
											onChangeText={(newText) => {
												const isGerman =
													locale === "de";

												// Allow digits, and either a comma (German) or dot (English)
												const allowedPattern = isGerman
													? /^[0-9]*[,]?[0-9]*$/
													: /^[0-9]*[.]?[0-9]*$/;

												if (
													allowedPattern.test(newText)
												) {
													setMaxMinValues(
														(prev: any) => ({
															...prev,
															maxY: newText,
														})
													);
												}
											}}
											placeholderTextColor="#9a9b9f"
											placeholder={
												locale === "de"
													? "00,00"
													: "00.00"
											}
											maxLength={10}
										/>
										<Text className="z-50 w-10 absolute top-3 right-2 font-bold size-6 text-chartText ">
											kWh
										</Text>
									</View>
								</View>
								{minMaxError && (
									<View className="mx-2">
										<Text className="text-sm text-red-600">
											Max value must be greater than min
											value.
										</Text>
									</View>
								)}
							</View>
						</View>
					)}

					{/* ok and cancel botton */}
					<View className="flex-row justify-end my-1 ">
						<Pressable
							className="px-6 py-2 mr-4"
							onPress={() => {
								if (Keyboard.isVisible()) {
									setKeyboardVisible(false);
									Keyboard.dismiss();
								}
								setModalVisible(false);
							}}
						>
							<Text className="text-chartText  font-medium text-base">
								{i18n.t("Cancel")}
							</Text>
						</Pressable>
						<Pressable
							className="px-4 py-2 mr-4"
							onPress={() => {
								if (
									dayjs(selectedStartDate) >
									dayjs(selectedEndDate)
								) {
									setDateError(true);
									return;
								}
								setDateError(false);
								if (maxMinValues.maxY < maxMinValues.minY) {
									setMinMaxError(true);
									return;
								}
								setMinMaxError(false);
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
						defaultDate={dayjs(selectedStartDate)}
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
						defaultDate={dayjs(selectedEndDate)}
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
