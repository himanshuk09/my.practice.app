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
import {
	initialDatePickerViewProps,
	PickerModelProps,
} from "@/types/date-time-picker.type";
import { englishLocale, i18n } from "@/localization/config";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PICKERVALIDATEMESSAGE } from "@/utils/messages";
import DateTimePickerComponents from "./DateTimePickerComponents";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { formatNumber, parseNumber } from "@/utils/formatting-utils";
import {
	DATE_FORMAT_PATTERNS,
	UNIT_PLACEHOLDER,
} from "@/utils/dateformatter.utils";

const PickerModel = ({
	range,
	setRange,
	screenName,
	modalVisible,
	setModalVisible,
	maxMinValues,
	setMaxMinValues,
	handleRangeDataFilter,
}: PickerModelProps) => {
	const animationHeight = useRef(new Animated.Value(0)).current;
	const locale = useSelector((state: RootState) => state.culture.locale);

	// State
	const [dateError, setDateError] = useState<boolean>(false);
	const [minMaxError, setMinMaxError] = useState<boolean>(false);
	const [dateErrorText, setDateErrorText] = useState<string>("");
	const [minMaxErrorText, setMinMaxErrorText] = useState<string>("");
	const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
	const [pickerInitialView, setPickerInitialView] =
		useState<initialDatePickerViewProps>("day");

	const [openPicker, setOpenPicker] = useState({
		startDate: false,
		endDate: false,
		range: false,
	});

	const initialRangeRef = useRef(range);
	const initialMaxMinRef = useRef(maxMinValues);

	// Derived values
	const isEng = locale === englishLocale;
	const dateFormat = isEng
		? DATE_FORMAT_PATTERNS.DATE_SLASHED_DD_MM_YYYY
		: DATE_FORMAT_PATTERNS.DATE_DOTTED_DD_MM_YYYY;
	const emptyDatePlaceholder = isEng
		? DATE_FORMAT_PATTERNS.DATE_PLACEHOLDER_SLASHED
		: DATE_FORMAT_PATTERNS.DATE_PLACEHOLDER_DOTTED;
	const numberPlaceholder = isEng
		? DATE_FORMAT_PATTERNS.DECIMAL_DOT
		: DATE_FORMAT_PATTERNS.DECIMAL_COMMA;

	// Validation functions
	const validateMinMax = (minInput: any, maxInput: any): boolean => {
		const min = parseNumber(maxMinValues.minY, locale);
		const max = parseNumber(maxMinValues.maxY, locale);

		if (minInput === "" || maxInput === "") {
			setMinMaxError(true);
			setMinMaxErrorText(PICKERVALIDATEMESSAGE.MIN_MAX.BOTH_REQUIRED);
			return false;
		}

		if (
			min === null ||
			max === null ||
			min === undefined ||
			max === undefined
		) {
			setMinMaxError(true);
			setMinMaxErrorText(PICKERVALIDATEMESSAGE.MIN_MAX.EMPTY_VALUES);
			return false;
		}

		if (max < min) {
			setMinMaxError(true);
			setMinMaxErrorText(PICKERVALIDATEMESSAGE.MIN_MAX.MAX_LESS_THAN_MIN);
			return false;
		}

		setMinMaxError(false);
		setMinMaxErrorText("");
		return true;
	};

	const validateStartEndDate = (startDate: any, endDate: any): boolean => {
		const isStartDateValid = dayjs(startDate).isValid();
		const isEndDateValid = dayjs(endDate).isValid();
		if (
			!isStartDateValid ||
			!isEndDateValid ||
			startDate === "" ||
			endDate === ""
		) {
			setDateError(true);
			setDateErrorText(PICKERVALIDATEMESSAGE.DATE.INVALID_DATES);
			return false;
		}

		if (
			dayjs(startDate).isAfter(dayjs(endDate)) ||
			dayjs(startDate).isSame(dayjs(endDate))
		) {
			setDateError(true);
			setDateErrorText(PICKERVALIDATEMESSAGE.DATE.END_BEFORE_START);
			return false;
		}

		setDateError(false);
		setDateErrorText("");
		return true;
	};

	// Handlers
	const handleInputChange = (text: string, key: any) => {
		const isValid = isEng
			? /^-?\d*(\.\d*)?$/.test(text)
			: /^-?\d*(,\d*)?$/.test(text);

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

	const handlePickerToggle = (
		pickerType: keyof typeof openPicker,
		initialView?: initialDatePickerViewProps
	) => {
		if (initialView) setPickerInitialView(initialView);
		setOpenPicker((prev) => ({
			...prev,
			[pickerType]: !prev[pickerType],
		}));
	};

	const handleCloseModal = () => {
		setKeyboardVisible(false);
		setDateError(false);
		setMinMaxError(false);
		setModalVisible?.(false);
	};

	const handleApply = () => {
		if (Keyboard.isVisible()) Keyboard.dismiss();
		if (!validateStartEndDate(range?.startDate, range?.endDate)) return;
		if (
			screenName != "prices" &&
			!validateMinMax(maxMinValues.minY, maxMinValues.maxY)
		) {
			return;
		}

		//Only Called if any change on dates or values range
		const initialRange = initialRangeRef.current;
		const initialMaxMin = initialMaxMinRef.current;

		const rangeChanged =
			dayjs(range?.startDate).valueOf() !==
				dayjs(initialRange?.startDate).valueOf() ||
			dayjs(range?.endDate).valueOf() !==
				dayjs(initialRange?.endDate).valueOf();

		const maxMinChanged =
			maxMinValues.minY !== initialMaxMin.minY ||
			maxMinValues.maxY !== initialMaxMin.maxY;

		if (rangeChanged || maxMinChanged) {
			handleRangeDataFilter();
		}
		setModalVisible?.(false);
	};

	// Effects
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

	useEffect(() => {
		Animated.timing(animationHeight, {
			toValue: isKeyboardVisible ? 0 : Platform.OS === "web" ? 185 : 165,
			duration: 200,
			easing: Easing.inOut(Easing.linear),
			useNativeDriver: false,
		}).start();
	}, [isKeyboardVisible]);

	useEffect(() => {
		if (modalVisible) {
			initialRangeRef.current = range;
			initialMaxMinRef.current = maxMinValues;
		}
	}, [modalVisible]);

	// Render helpers
	const renderDatePickerButton = (
		date: any,
		onPress: () => void,
		showTimeIcon: boolean = false,
		format: any = dateFormat
	) => (
		<Pressable
			className="bg-cardBg p-3 flex-row justify-between"
			onPress={onPress}
		>
			<Text className="text-slate-700">
				{dayjs(date).isValid()
					? dayjs(date).locale(locale).format(format)
					: format === dateFormat
						? emptyDatePlaceholder
						: DATE_FORMAT_PATTERNS.PLACEHOLDER}
			</Text>
			{showTimeIcon ? (
				<Ionicons name="alarm" size={20} color="#808080" />
			) : (
				<FontAwesome name="calendar" size={18} color="#808080" />
			)}
		</Pressable>
	);

	const renderNumberInput = (key: "minY" | "maxY", label: string) => (
		<View className="mx-2 mb-2 w-[50%]">
			<Text className="text-chartText mb-1 font-semibold">
				{i18n.t(label)}
			</Text>
			<View>
				<TextInput
					className="bg-cardBg text-slate-700 p-3"
					style={{ height: 40, padding: 10 }}
					keyboardType="numeric"
					value={maxMinValues[key].toString()}
					onChangeText={(text) => handleInputChange(text, key)}
					onBlur={() => handleBlur(key, maxMinValues[key])}
					placeholderTextColor="#9a9b9f"
					placeholder={numberPlaceholder}
					maxLength={10}
				/>
				<Text className="z-50 w-10 absolute top-3 right-2 font-light size-6 text-slate-600">
					{UNIT_PLACEHOLDER.PLACEHOLDER_KWH_UNIT}
				</Text>
			</View>
		</View>
	);
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={handleCloseModal}
		>
			<View
				className={`flex-1 pt-20 bg-[#0a0a0aa8] bg-opacity-50 ${Platform.OS === "web" && "justify-center items-center"}`}
			>
				<View
					className={`bg-white mx-4 ${Platform.OS === "web" && "w-80"}`}
				>
					{/* Header */}
					<View className="flex-row justify-between p-3 bg-secondary pl-5">
						<Text className="text-chartText font-bold text-lg">
							{i18n.t("Period_of_Time")}
						</Text>
						<TouchableOpacity
							className="m-1"
							onPress={handleCloseModal}
						>
							<AntDesign name="close" size={23} color="#E63757" />
						</TouchableOpacity>
					</View>
					{/**
					 * load data Screen ---> Single picker and custom value
					 * PFC ---> Single  picker
					 * Prices ---> Range picker
					 */}

					{screenName === "prices" ? (
						<View className="p-5">
							<View className="flex-row justify-between items-center mb-2">
								<View className="flex-1 mr-2">
									<Text className="text-chartText mb-1 font-semibold">
										{i18n.t("From")}
									</Text>
									{renderDatePickerButton(
										range?.startDate,
										() => handlePickerToggle("range")
									)}
								</View>
							</View>
							<View className="flex-row justify-between items-center">
								<View className="flex-1 mr-2">
									<Text className="text-chartText mb-1">
										{i18n.t("To")}
									</Text>
									{renderDatePickerButton(
										range?.endDate,
										() => handlePickerToggle("range")
									)}
								</View>
							</View>
							{dateError && (
								<View className="mx-2 mb-1">
									<Text className="text-sm text-red-600">
										{i18n.t(dateErrorText)}
									</Text>
								</View>
							)}
						</View>
					) : (
						<Animated.View
							style={{
								overflow: "hidden",
								height: animationHeight,
							}}
							className="mx-4"
						>
							<View className="flex-row justify-between items-center m-2">
								<View className="flex-1 mr-2">
									<Text className="text-chartText mb-1 font-semibold">
										{i18n.t("From")}
									</Text>
									{renderDatePickerButton(
										range?.startDate,
										() =>
											handlePickerToggle(
												"startDate",
												"day"
											)
									)}
								</View>
								<View className="flex-1 ml-2">
									<Text className="text-gray-400 mb-1">
										{" "}
									</Text>
									{renderDatePickerButton(
										range?.startDate,
										() =>
											handlePickerToggle(
												"startDate",
												"time"
											),
										true,
										DATE_FORMAT_PATTERNS.TIME_PARSE_HH_MM
									)}
								</View>
							</View>
							<View className="flex-row justify-between items-center mx-2">
								<View className="flex-1 mr-2">
									<Text className="text-chartText mb-1 font-semibold">
										{i18n.t("To")}
									</Text>
									{renderDatePickerButton(
										range?.endDate,
										() =>
											handlePickerToggle("endDate", "day")
									)}
								</View>
								<View className="flex-1 ml-2">
									<Text className="text-gray-400 mb-1">
										{" "}
									</Text>
									{renderDatePickerButton(
										range?.endDate,
										() =>
											handlePickerToggle(
												"endDate",
												"time"
											),
										true,
										DATE_FORMAT_PATTERNS.TIME_PARSE_HH_MM
									)}
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

					{screenName === "loaddata" && (
						<View>
							<Text className="text-chartText font-bold text-lg p-3 pl-5 bg-[#ebebeb]">
								{i18n.t("Value_Range")}
							</Text>
							<View className="flex-col m-4">
								{renderNumberInput("minY", "From")}
								{renderNumberInput("maxY", "To")}
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

					{/* Footer buttons */}
					<View className="flex-row justify-end my-1">
						<Pressable
							className="px-6 py-2 mr-4"
							onPress={handleCloseModal}
						>
							<Text className="text-chartText font-medium text-base">
								{i18n.t("Cancel")}
							</Text>
						</Pressable>
						<Pressable
							className="px-4 py-2 mr-4"
							onPress={handleApply}
						>
							<Text className="text-red-600 font-medium text-base">
								{i18n.t("OK")}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>

			{/* Date Pickers */}
			{openPicker.startDate && (
				<Pressable className="absolute z-50 inset-0 flex flex-row justify-center items-center m-auto bg-[#0a0a0aa8]">
					<DateTimePickerComponents
						title="Select_Start_Date"
						open={openPicker.startDate}
						timePicker={true}
						setOpen={() => handlePickerToggle("startDate")}
						setSingleDate={(date: any) => {
							setRange((prev: any) => ({
								...prev,
								startDate: date,
							}));
						}}
						defaultDate={dayjs(range?.startDate)}
						initialView={pickerInitialView}
					/>
				</Pressable>
			)}
			{openPicker.endDate && (
				<Pressable className="absolute z-50 inset-0 flex flex-row justify-center items-center m-auto bg-[#0a0a0aa8]">
					<DateTimePickerComponents
						title="Select_End_Date"
						open={openPicker.endDate}
						timePicker={true}
						setOpen={() => handlePickerToggle("endDate")}
						setSingleDate={(date: any) => {
							setRange((prev: any) => ({
								...prev,
								endDate: date,
							}));
						}}
						defaultDate={dayjs(range?.endDate)}
						initialView={pickerInitialView}
					/>
				</Pressable>
			)}
			{openPicker.range && (
				<Pressable className="absolute z-50 inset-0 top-30 flex flex-row justify-center items-center m-auto bg-[#0a0a0aa8]">
					<DateTimePickerComponents
						title="Select_Date_Range"
						pickerMode="range"
						open={openPicker.range}
						timePicker={false}
						range={range}
						setRange={setRange}
						setOpen={() => handlePickerToggle("range")}
					/>
				</Pressable>
			)}
		</Modal>
	);
};

export default PickerModel;
