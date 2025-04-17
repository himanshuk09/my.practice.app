import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import DateTimePicker, { DateType, ModeType } from "react-native-ui-datepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/tr";
import "dayjs/locale/en-in";
import { useSelector } from "react-redux";
import { i18n } from "@/localization/config";

type DateTimePickerComponentsProps = {
	title?: String;
	timePicker?: boolean | undefined;
	pickerMode?: ModeType;
	open?: Boolean;
	setOpen?: any;
	setSingleDate?: any;
	defaultDate?: DateType;
	initialView?: "day" | "month" | "year" | "time";
	setSelectedStartDate?: any;
	setSelectedEndDate?: any;
	rangeDate?: any;
	setRangeDate?: any;
};
const DateTimePickerComponents = ({
	title = "Select",
	timePicker = true,
	pickerMode = "single",
	open,
	setOpen,
	setSingleDate,
	defaultDate,
	initialView = "day",
	setSelectedStartDate,
	setSelectedEndDate,
	rangeDate,
	setRangeDate,
}: DateTimePickerComponentsProps) => {
	const [mode] = useState<ModeType>(pickerMode);
	const [date, setDate] = useState<DateType | undefined>(defaultDate);
	const [range, setRange] = React.useState<{
		startDate: DateType;
		endDate: DateType;
	}>(rangeDate);
	const [dates, setDates] = useState<DateType[] | undefined>();
	const locale = useSelector((state: any) => state.culture.locale);

	const onChange = useCallback(
		(params: any) => {
			if (mode === "single") {
				setDate(params.date);
				setSingleDate(params.date);
			} else if (mode === "range") {
				setRange(params);
				setRangeDate(params);

				// Only update start date if it has changed
				setSelectedStartDate((prev: any) =>
					params?.startDate !== prev ? params?.startDate : prev
				);

				// Only update end date if it has changed
				setSelectedEndDate((prev: any) =>
					params?.endDate !== prev ? params?.endDate : prev
				);
			} else if (mode === "multiple") {
				setDates(params.dates);
			}
		},
		[mode]
	);

	if (!open) return null;
	return (
		<Pressable
			className={`w-80 -z-0 bg-[#fff] p-1 rounded-sm  md:mt-9 md:ml-5  shadow-lg`}
		>
			<View className="flex flex-row items-start justify-between">
				<Text className="text-slate-90000 font-bold my-1 ml-1">
					{i18n.t(title)}
				</Text>
				<TouchableOpacity
					className="m-1"
					onPress={() => setOpen(!open)}
				>
					<AntDesign name="close" size={20} color="#E63757" />
				</TouchableOpacity>
			</View>
			<DateTimePicker
				mode={mode}
				locale={locale}
				date={date} //single picker
				startDate={range?.startDate} //range picker start date
				endDate={range?.endDate} //range picker end date
				dates={dates} //multiple date
				initialView={initialView} //day or time
				firstDayOfWeek={1}
				height={300}
				// minDate={dayjs().startOf('day')}
				// maxDate={dayjs().add(3, 'day').endOf('day')}
				//disabledDates={[dayjs(), dayjs().add(1, 'day')]}
				//disabledDates={(date) => [0, 6].includes(dayjs(date).day())} // disable weekends
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

			<View className="px-3 pb-2 relative">
				{mode === "single" ? (
					<View className=" flex-col items-start justify-between">
						<View className="w-full items-center">
							<Text className="mb-3 text-center">
								{date
									? dayjs(date)
											.locale(locale)
											.format(
												locale === "en"
													? timePicker
														? "DD/MM/YYYY HH:mm"
														: "DD/MM/YYYY"
													: timePicker
														? "DD.MM.YYYY HH:mm"
														: "DD.MM.YYYY"
											)
									: "..."}
							</Text>
						</View>
						<View className="flex-row justify-between flex w-full">
							<Pressable
								onPress={() => {
									setDate(new Date());
									setSingleDate(new Date());
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
										setTimeout(() => setOpen(false), 100);
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
						<View className="flex flex-row">
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
											.format(
												locale === "en"
													? timePicker
														? "DD/MM/YYYY HH:mm"
														: "DD/MM/YYYY"
													: timePicker
														? "DD.MM.YYYY HH:mm"
														: "DD.MM.YYYY"
											)
									: "..."}
							</Text>
						</View>
						<View className="flex flex-row">
							<Text
								style={{
									marginRight: 5,
									fontWeight: "bold",
								}}
							>
								{i18n.t("To")} :
							</Text>
							<Text className="mx-3">
								{range.endDate
									? dayjs(range.endDate)
											.locale(locale)
											.format(
												locale === "en"
													? timePicker
														? "DD/MM/YYYY HH:mm"
														: "DD/MM/YYYY"
													: timePicker
														? "DD.MM.YYYY HH:mm"
														: "DD.MM.YYYY"
											)
									: "..."}
							</Text>
						</View>
						{range && (
							<Pressable
								onPress={() => {
									setTimeout(() => setOpen(false), 100);
								}}
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
										.format("MMM, DD, YYYY")}
								</Text>
							))}
					</View>
				) : null}
			</View>
		</Pressable>
	);
};

export default DateTimePickerComponents;
