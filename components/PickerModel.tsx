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
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DateType } from "react-native-ui-datepicker";
import DateTimePickerComponents from "./DateTimePickerComponents";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { englishLocale, germanyLocale, i18n } from "@/localization/config";

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

const formatNumber = (value: number, locale: string): string => {
	return new Intl.NumberFormat(locale, {
		useGrouping: false,
		minimumFractionDigits: 0,
		maximumFractionDigits: 10,
	}).format(value);
};
const parseNumber = (
	value: string | number | null | undefined | any,
	locale: string
): number => {
	if (value === null || value === undefined || value === 0) {
		return 0;
	}
	const normalized =
		locale === germanyLocale
			? value?.replace(/\./g, "").replace(",", ".")
			: value;
	return parseFloat(normalized);
};

const PickerModel = ({
	maxMinValues,
	setMaxMinValues,
	showRangePicker = false,
	showValueRange = false,
	modalVisible,
	setModalVisible,
	selectedStartDate,
	setSelectedStartDate,
	selectedEndDate,
	setSelectedEndDate,
	handleRangeDataFilter,
}: PickerModelProps) => {
	const [dateError, setDateError] = useState<boolean>(false);
	const [minMaxError, setMinMaxError] = useState<boolean>(false);
	const [dateErrorText, setDateErrorText] = useState<string>("");
	const [minMaxErrorText, setMinMaxErrorText] = useState<string>("");
	const animationHeight = useRef(new Animated.Value(0)).current;
	const { locale } = useSelector((state: RootState) => state.culture);
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

	const validateMinMax = (minInput: any, maxInput: any): boolean => {
		const min = parseNumber(maxMinValues.minY, locale);
		const max = parseNumber(maxMinValues.maxY, locale);

		if (minInput === "" || maxInput === "") {
			setMinMaxError(true);
			setMinMaxErrorText("Both_min_and_max_are_required");
			return false;
		}

		if (
			min === null ||
			max === null ||
			min === undefined ||
			max === undefined
		) {
			setMinMaxError(true);
			setMinMaxErrorText("Values_cannot_be_empty");
			return false;
		}
		if (max < min) {
			setMinMaxError(true);
			setMinMaxErrorText("Max_value_must_be_greater_than_min");
			return false;
		}

		setMinMaxError(false);
		setMinMaxErrorText(""); // Clear previous errors
		return true;
	};

	const validateStartEndDate = (
		selectedStartDate: string | Date,
		selectedEndDate: string | Date
	): boolean => {
		const isStartDateValid = dayjs(selectedStartDate).isValid();
		const isEndDateValid = dayjs(selectedEndDate).isValid();
		if (selectedStartDate === "" || selectedEndDate === "") {
			setDateError(false);
			return true;
		}
		if (!isStartDateValid || !isEndDateValid) {
			setDateError(true);
			setDateErrorText("Please_enter_valid_start_and_end_dates");
			return false;
		}

		if (dayjs(selectedStartDate).isAfter(dayjs(selectedEndDate))) {
			setDateError(true);
			setDateErrorText("The_end_date_must_be_later_than_start_date");
			return false;
		}

		setDateError(false);
		setDateErrorText("");
		return true;
	};

	const handleInputChange = (text: string, key: any) => {
		let isValid = false;
		let isEng = locale === englishLocale;
		if (isEng) {
			// Allow only digits and one dot, no commas
			isValid = /^-?\d*(\.\d*)?$/.test(text);
		} else {
			// Allow only digits and one comma, no dots
			isValid = /^-?\d*(,\d*)?$/.test(text);
		}

		if (isValid || text === "" || text === "-") {
			setMaxMinValues((prev: any) => ({
				...prev,
				[key]: text,
			}));
		}
	};
	const handleBlur = (key: any, value: any) => {
		const parsed = parseNumber(value, locale);
		if (!isNaN(parsed)) {
			setMaxMinValues((prev: any) => ({
				...prev,
				[key]: formatNumber(parsed, locale),
			}));
		}
	};

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
			toValue: isKeyboardVisible ? 0 : Platform.OS === "web" ? 185 : 165, // Collapse on keyboard open, expand otherwise
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
					className={`bg-white mx-4 ${Platform.OS === "web" && "w-80"} `}
				>
					{/* Period of Time Header*/}
					<View className="flex-row justify-between p-3  bg-secondary pl-5 ">
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
							onPress={() => {
								setModalVisible(!modalVisible);
								setDateError(false);
								setMinMaxError(false);
							}}
						>
							<AntDesign
								name="close"
								className="font-bold"
								size={23}
								color="#E63757"
							/>
						</TouchableOpacity>
					</View>

					{showRangePicker ? (
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
															locale ===
																englishLocale
																? "DD/MM/YYYY"
																: "DD.MM.YYYY"
														)
												: dayjs()
														.locale(locale)
														.format(
															locale ===
																englishLocale
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
															locale ===
																englishLocale
																? "DD/MM/YYYY"
																: "DD.MM.YYYY"
														)
												: dayjs()
														.locale(locale)
														.format(
															locale ===
																englishLocale
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
					) : (
						<Animated.View
							style={{
								overflow: "hidden",
								height: animationHeight, // Controlled by animation
								// marginBottom: 5,
							}}
							className="mx-4"
						>
							<View className="flex-row justify-between items-center m-2">
								<View className="flex-1 mr-2">
									<Text className=" text-chartText  mb-1 font-semibold">
										{i18n.t("From")}
									</Text>
									<Pressable
										className=" bg-cardBg  p-3 flex-row justify-between"
										onPress={() => {
											setOpenStartDate(!openStartDate);
											setPickerInitaialView("day");
										}}
									>
										<Text className="text-slate-700">
											{dayjs(selectedStartDate).isValid()
												? dayjs(selectedStartDate)
														.locale(locale)
														.format(
															locale ===
																englishLocale
																? "DD/MM/YYYY"
																: "DD.MM.YYYY"
														)
												: locale === englishLocale
													? "-- / -- /----"
													: "-- . -- . ----"}
											{/* dayjs()
														.locale(locale)
														.format(
															locale === englishLocale
																? "DD/MM/YYYY"
																: "DD.MM.YYYY"
														) */}
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
											setOpenStartDate(!openStartDate);
											setPickerInitaialView("time");
										}}
									>
										<Text className="text-slate-700">
											{dayjs(selectedStartDate).isValid()
												? dayjs(selectedStartDate)
														.locale(englishLocale)
														.format("HH:mm")
												: "-- : --"}
											{/* dayjs()
														.locale(englishLocale)
														.format("HH:mm") */}
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
											{dayjs(selectedEndDate).isValid()
												? dayjs(selectedEndDate)
														.locale(locale)
														.format(
															locale ===
																englishLocale
																? "DD/MM/YYYY"
																: "DD.MM.YYYY"
														)
												: locale === englishLocale
													? "-- / -- /----"
													: "-- . -- . ----"}
											{/* dayjs()
														.locale(locale)
														.format(
															locale === englishLocale
																? "DD/MM/YYYY"
																: "DD.MM.YYYY"
														) */}
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
											setOpenStartDate(!openStartDate);
											setPickerInitaialView("time");
										}}
									>
										<Text className="text-slate-700">
											{dayjs(selectedEndDate).isValid()
												? dayjs(selectedEndDate)
														.locale(englishLocale)
														.format("HH:mm")
												: "-- : --"}
											{/* dayjs()
														.locale(englishLocale)
														.format("HH:mm") */}
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
								<View className="mx-2 mb-1">
									<Text className="text-sm text-red-600">
										{i18n.t(dateErrorText)}
									</Text>
								</View>
							)}
						</Animated.View>
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
											onChangeText={(text) =>
												handleInputChange(text, "minY")
											}
											onBlur={() =>
												handleBlur(
													"minY",
													maxMinValues.minY
												)
											}
											placeholderTextColor="#9a9b9f"
											placeholder={
												locale === germanyLocale
													? "00,00"
													: "00.00"
											}
											maxLength={10}
										/>
										<Text className="z-50 w-10 absolute top-3 right-2 font-light size-6 text-slate-600">
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
											onChangeText={(text) =>
												handleInputChange(text, "maxY")
											}
											onBlur={() =>
												handleBlur(
													"maxY",
													maxMinValues.maxY
												)
											}
											placeholderTextColor="#9a9b9f"
											placeholder={
												locale === germanyLocale
													? "00,00"
													: "00.00"
											}
											maxLength={10}
										/>
										<Text className="z-50 w-10 absolute top-3 right-2 font-light size-6 text-slate-600 ">
											kWh
										</Text>
									</View>
								</View>
								{minMaxError && (
									<View className="mx-2">
										<Text className="text-sm text-red-600">
											{i18n.t(minMaxErrorText)}
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
								setDateError(false);
								setMinMaxError(false);
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
								// Check if either start or end date is invalid or start > end
								if (
									!validateStartEndDate(
										selectedStartDate,
										selectedEndDate
									)
								) {
									return;
								}
								if (
									!validateMinMax(
										maxMinValues.minY,
										maxMinValues.maxY
									)
								) {
									// Validate min/max numbers
									return;
								}

								if (
									selectedStartDate === "" ||
									selectedEndDate === ""
								) {
									setModalVisible(false);
									return;
								}
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
					className="absolute z-50 inset-0 flex flex-row justify-center items-center m-auto bg-[#0a0a0aa8] "
					// onPress={() => setOpenStartDate(false)}
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
					// onPress={() => setOpenEndDate(false)}
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
