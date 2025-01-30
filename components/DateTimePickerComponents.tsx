import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import DateTimePicker, { DateType, ModeType } from "react-native-ui-datepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/tr";
import "dayjs/locale/en-in";
import { useSelector } from "react-redux";
import { i18n } from "@/localization/localConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const DateTimePickerComponents = ({
    title = "Select",
    timePicker = true,
    pickerMode = "single",
    open,
    setOpen,
    setSingleDate,
    setRangeDate,
}: any) => {
    const [mode, setMode] = useState<ModeType>(pickerMode);
    const [date, setDate] = useState<DateType | undefined>(dayjs());
    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });
    const [dates, setDates] = useState<DateType[] | undefined>();
    const locale = useSelector((state: any) => state.language.locale);
    const onChangeMode = useCallback(
        (value: ModeType) => {
            setDate(undefined);
            setRange({ startDate: undefined, endDate: undefined });
            setDates(undefined);
            setMode(value);
        },
        [setMode, setDate, setRange, setDates]
    );

    const onChange = useCallback(
        (params: any) => {
            if (mode === "single") {
                setDate(params.date);
                setSingleDate(params.date);
            } else if (mode === "range") {
                setRange(params);
                setRangeDate(params);
            } else if (mode === "multiple") {
                setDates(params.dates);
            }
        },
        [mode]
    );

    // useEffect(() => {
    //   setStartDate(range.startDate);
    // }, [range.startDate]);
    // useEffect(() => {
    //   setEndDate(range.endDate);
    // }, [range.endDate]);
    if (!open) return null;
    return (
        <SafeAreaView>
            <View
                className={`w-80 -z-0 bg-[#fff] p-1 rounded-md  md:mt-9 md:ml-5  shadow-lg`}
            >
                <View className="flex flex-row items-start justify-between">
                    <Text className="text-slate-90000 font-bold my-1 ml-1">
                        {title}
                    </Text>
                    <TouchableOpacity
                        className="m-1"
                        onPress={() => setOpen(!open)}
                    >
                        <AntDesign name="close" size={15} color="#E63757" />
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    mode={mode}
                    date={date}
                    locale={locale}
                    startDate={range.startDate}
                    endDate={range.endDate}
                    dates={dates}
                    // minDate={dayjs().startOf('day')}
                    // maxDate={dayjs().add(3, 'day').endOf('day')}
                    //disabledDates={[dayjs(), dayjs().add(1, 'day')]}
                    // disabledDates={(date) => [0, 6].includes(dayjs(date).day())} // disable weekends
                    //firstDayOfWeek={1}
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
                                    {/* {date
                                ? dayjs(date)
                                      .locale(locale)
                                      .format(
                                          timePicker
                                              ? "MMM DD YYYY   HH:mm"
                                              : "MMM DD YYYY"
                                      )
                                : "..."} */}
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
                                    <View className="bg-[#E63757] px-3 py-2  rounded-md items-center ">
                                        <Text className="text-white font-medium">
                                            {i18n.t("today")}
                                        </Text>
                                    </View>
                                </Pressable>
                                {date && (
                                    <Pressable
                                        onPress={() => {
                                            setTimeout(
                                                () => setOpen(false),
                                                100
                                            );
                                        }}
                                        accessibilityRole="button"
                                        accessibilityLabel="select"
                                    >
                                        <View className="bg-[#E63757] px-4 py-2  rounded-md items-center ">
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
                                {/* {range.startDate
                                ? dayjs(range.startDate)
                                      .locale(locale)
                                      .format("MMM, DD, YYYY")
                                : "..."} */}
                                <Text className="mx-3">
                                    {range.startDate
                                        ? dayjs(range.startDate)
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
                                {/* {range.endDate
                                ? dayjs(range.endDate)
                                      .locale(locale)
                                      .format("MMM, DD, YYYY")
                                : "..."} */}
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
                            {date && (
                                <Pressable
                                    onPress={() => {
                                        setTimeout(() => setOpen(false), 100);
                                    }}
                                    accessibilityRole="button"
                                    accessibilityLabel="select"
                                    style={{ marginBottom: 2 }}
                                >
                                    <View className="bg-[#E63757] px-4 py-2 my-1 rounded-md items-center ">
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
            </View>
        </SafeAreaView>
    );
};

export default DateTimePickerComponents;

{
    /* <View className=" absolute bottom-2 right-3 flex-row justify-end p-0">
		{range.startDate && range.endDate ? (
		  <TouchableOpacity
			className="mx-1 mb-1 p-1 rounded-md bg-[#E63757] hover:bg-[#fc2e54]"
			onPress={() => {
			  setOpen(false);
			  
			}}
		  >
			<Text className="text-white mx-1 font-semibold">
			  Filter
			  <FontAwesome
				name="filter"
				size={15}
				color="white"
				className="ml-1"
			  />
			</Text>
		  </TouchableOpacity>
		) : null}
		<TouchableOpacity
		  className="mx-1 mb-1 p-1 rounded-md bg-[#f56d86] hover:bg-[#E63757]"
		  onPress={() => {
			setOpen(!open);
			setStartDate("");
			setEndDate("");
			setRange({ startDate: undefined, endDate: undefined });
		  }}
		>
		  <Text className="text-white mx-1 font-semibold">Close</Text>
		</TouchableOpacity>
	  </View> */
}
