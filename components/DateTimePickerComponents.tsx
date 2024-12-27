import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DateTimePicker, { DateType, ModeType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/tr";
import "dayjs/locale/en-in";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome } from "@expo/vector-icons";

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
  // const [timePicker, setTimePicker] = useState(false);
  const [date, setDate] = useState<DateType | undefined>(dayjs());
  const [range, setRange] = React.useState<{
    startDate: DateType;
    endDate: DateType;
  }>({ startDate: undefined, endDate: undefined });
  const [dates, setDates] = useState<DateType[] | undefined>();

  const [locale, setLocale] = useState("de");
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
    <View className="w-96  -z-0 bg-[#fff] p-1 rounded-md mt-20 md:mt-9 md:ml-5  shadow-lg">
      <View className="flex-row justify-between">
        <Text className="text-slate-90000 font-bold my-1 ml-1">{title}</Text>
        <TouchableOpacity className="m-1" onPress={() => setOpen(!open)}>
          <AntDesign name="close" size={15} color="#E63757" />
        </TouchableOpacity>
      </View>
      <DateTimePicker
        mode={mode}
        date={date}
        locale={"en-in"}
        startDate={range.startDate}
        endDate={range.endDate}
        dates={dates}
        //minDate={dayjs().startOf('day')}
        //maxDate={dayjs().add(3, 'day').endOf('day')}
        //disabledDates={[dayjs(), dayjs().add(1, 'day')]}
        //disabledDates={(date) => [0, 6].includes(dayjs(date).day())} // disable weekends
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
          <View className=" flex-row items-center justify-between">
            <Text>
              {date
                ? dayjs(date)
                    .locale(locale)
                    .format(timePicker ? "MMM DD YYYY   HH:mm" : "MMM DD YYYY")
                : "..."}
            </Text>
            {date && (
              <Pressable
                onPress={() => {
                  setTimeout(() => setOpen(false), 100);
                }}
                accessibilityRole="button"
                accessibilityLabel="Set"
              >
                <View className="bg-[#E63757] px-4 py-2  rounded-md items-center ">
                  <Text className="text-white font-medium">Set</Text>
                </View>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                setDate(new Date());
                setSingleDate(new Date());
                setTimeout(() => setOpen(false), 100);
              }}
              accessibilityRole="button"
              accessibilityLabel="Today"
            >
              <View className="bg-[#E63757] px-4 py-2  rounded-md items-center ">
                <Text className="text-white font-medium">Today</Text>
              </View>
            </Pressable>
          </View>
        ) : mode === "range" ? (
          <View style={{ gap: 3 }}>
            <Text>
              <Text style={{ marginRight: 5, fontWeight: "bold" }}>
                Start Date:
              </Text>
              {range.startDate
                ? dayjs(range.startDate).locale(locale).format("MMM, DD, YYYY")
                : "..."}
            </Text>
            <Text>
              <Text style={{ marginRight: 5, fontWeight: "bold" }}>
                End Date:
              </Text>
              {range.endDate
                ? dayjs(range.endDate).locale(locale).format("MMM, DD, YYYY")
                : "..."}
            </Text>
            {date && (
              <Pressable
                onPress={() => {
                  setTimeout(() => setOpen(false), 100);
                }}
                accessibilityRole="button"
                accessibilityLabel="Set"
              >
                <View className="bg-[#E63757] px-4 py-2 my-1 rounded-md items-center ">
                  <Text className="text-white font-medium">Set</Text>
                </View>
              </Pressable>
            )}
          </View>
        ) : mode === "multiple" ? (
          <View style={{ gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Selected Dates:</Text>
            {dates &&
              dates.map((d, index) => (
                <Text key={index}>
                  {dayjs(d).locale(locale).format("MMM, DD, YYYY")}
                </Text>
              ))}
          </View>
        ) : null}
      </View>
    </View>
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
