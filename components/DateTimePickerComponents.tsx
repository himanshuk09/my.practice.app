import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	Platform,
} from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/tr";
import "dayjs/locale/en-in";
import { useSelector } from "react-redux";
import React, { useCallback, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { englishLocale, i18n } from "@/localization/config";
import DateTimePicker, { DateType, ModeType } from "react-native-ui-datepicker";
import { DateTimePickerComponentsProps } from "@/types/date-time-picker.type";
import { DATE_FORMAT_PATTERNS } from "@/utils/dateformatter.utils";

const DateTimePickerComponents = ({
	title = "Select",
	timePicker = true,
	pickerMode = "single",
	open,
	setOpen,
	setSingleDate,
	defaultDate,
	initialView = "day",
	range,
	setRange,
}: DateTimePickerComponentsProps) => {
	const [mode] = useState<ModeType>(pickerMode);
	const locale = useSelector((state: any) => state.culture.locale);
	const [date, setDate] = useState<DateType>(
		dayjs(defaultDate).isValid() ? defaultDate : dayjs().startOf("day")
	);
	const [dates, setDates] = useState<DateType[]>();
	const [hasInteracted, setHasInteracted] = useState<boolean>(false);

	const onChange = useCallback(
		(params: any) => {
			setHasInteracted(true);
			if (mode === "single") {
				setDate(params.date);
				setSingleDate?.(params.date);
			} else if (mode === "range") {
				setRange?.({
					startDate: params.startDate,
					endDate: params.endDate,
				});
			} else if (mode === "multiple") {
				setDates(params.dates);
			}
		},
		[mode]
	);

	const isEng = locale === englishLocale;
	const singleDateFormate = isEng
		? DATE_FORMAT_PATTERNS.DATE_TIME_SLASHED_DD_MM_YYYY_HH_MM
		: DATE_FORMAT_PATTERNS.DATE_TIME_DOTTED_DD_MM_YYYY_HH_MM;
	const rangeDateFormate = isEng
		? DATE_FORMAT_PATTERNS.DATE_SLASHED_DD_MM_YYYY
		: DATE_FORMAT_PATTERNS.DATE_DOTTED_DD_MM_YYYY;
	const multipleDateFormate =
		DATE_FORMAT_PATTERNS.DATE_MONTH_NAME_MMM_DD_YYYY;

	if (!open) return null;
	return (
		<Pressable
			className={`${Platform.OS === "web" ? "w-80" : "w-[23rem]"} mx-1 -z-0 bg-[#fff] p-2  md:mt-9 md:ml-5 `}
		>
			<View className="flex flex-row  items-start my-2 justify-between">
				<Text className="text-slate-90000 font-bold my-1 ml-1">
					{i18n.t(title)}
				</Text>
				<TouchableOpacity
					className="m-1"
					onPress={() => setOpen?.(!open)}
				>
					<AntDesign name="close" size={22} color="#E63757" />
				</TouchableOpacity>
			</View>
			<DateTimePicker
				mode={mode}
				locale={locale}
				//single picker
				date={date}
				//range picker start date
				startDate={range?.startDate}
				//range picker end date
				endDate={range?.endDate}
				//multiple date
				dates={dates}
				// "day" | "month" | "year" | "time"
				initialView={initialView}
				firstDayOfWeek={1}
				height={300}
				//minDate={dayjs().startOf("day")}
				//maxDate={dayjs().add(7, "day").endOf("day")}
				//disabledDates={[dayjs(), dayjs().add(1, "day")]} // we can add the date in array
				disabledDates={(date) =>
					dayjs(date).isAfter(dayjs().add(10, "year"), "day")
				}
				displayFullDays
				timePicker={timePicker}
				onChange={onChange}
				headerButtonColor="#E63757"
				selectedItemColor="#E63757"
				// eslint-disable-next-line react-native/no-inline-styles
				selectedTextStyle={{
					fontWeight: "bold",
					color: "#fff",
				}}
				// eslint-disable-next-line react-native/no-inline-styles
				todayContainerStyle={{
					borderWidth: 1,
				}}
			/>

			<View className="px-3 pb-4 relative">
				{mode === "single" ? (
					<View
						style={{ gap: 3 }}
						className=" flex-col items-start justify-between"
					>
						<View className="w-full items-center">
							<Text className="mb-3 text-center">
								{date
									? dayjs(date)
											.locale(locale)
											.format(singleDateFormate)
									: "..."}
							</Text>
						</View>
						<View className="flex-row justify-between flex w-full">
							<Pressable
								onPress={() => {
									setDate(dayjs().startOf("day"));
									setSingleDate?.(dayjs().startOf("day"));
								}}
								accessibilityRole="button"
								accessibilityLabel="Today"
							>
								<View className="bg-[#E63757] px-3 py-2  rounded-sm items-center ">
									<Text className="text-white font-medium">
										{i18n.t("today")}
									</Text>
								</View>
							</Pressable>
							{date && (
								<Pressable
									onPress={() => {
										if (!hasInteracted) {
											setSingleDate?.(date);
										}
										setOpen?.(false);
									}}
									accessibilityRole="button"
									accessibilityLabel="select"
								>
									<View className="bg-[#E63757] px-4 py-2  rounded-sm items-center ">
										<Text className="text-white font-medium">
											{i18n.t("select")}
										</Text>
									</View>
								</Pressable>
							)}
						</View>
					</View>
				) : mode === "range" ? (
					<View style={{ gap: 3 }}>
						<View className="flex flex-row mt-5">
							<Text
								style={{
									marginRight: 5,
									fontWeight: "bold",
								}}
							>
								{i18n.t("From")} :
							</Text>
							<Text className="mx-3">
								{range?.startDate
									? dayjs(range?.startDate)
											.locale(locale)
											.format(rangeDateFormate)
									: "..."}
							</Text>
						</View>
						<View className="flex flex-row mb-5">
							<Text
								style={{
									marginRight: 5,
									fontWeight: "bold",
								}}
							>
								{i18n.t("To")} :
							</Text>
							<Text className="mx-3">
								{range?.endDate
									? dayjs(range?.endDate)
											.locale(locale)
											.format(rangeDateFormate)
									: "..."}
							</Text>
						</View>
						{range?.endDate && (
							<Pressable
								onPress={() => setOpen?.(false)}
								accessibilityRole="button"
								accessibilityLabel="select"
								style={{ marginBottom: 2 }}
							>
								<View className="bg-[#E63757] px-4 py-2 my-1 rounded-sm items-center ">
									<Text className="text-white font-medium">
										{i18n.t("select")}
									</Text>
								</View>
							</Pressable>
						)}
					</View>
				) : mode === "multiple" ? (
					<View style={{ gap: 3 }}>
						<Text style={{ fontWeight: "bold" }}>
							Selected Dates:
						</Text>
						{dates &&
							dates.map((d, index) => (
								<Text key={index}>
									{dayjs(d)
										.locale(locale)
										.format(multipleDateFormate)}
								</Text>
							))}
					</View>
				) : null}
			</View>
		</Pressable>
	);
};

export default DateTimePickerComponents;
