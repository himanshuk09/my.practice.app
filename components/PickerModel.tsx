import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
    Easing,
} from "react-native";
import DateTimePickerComponents from "./DateTimePickerComponents";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const PickerModel = ({
    showRangePicker = true,
    showPeriodOfTime = true,
    showValueRange = true,
    modalVisible,
    setModalVisible,
    setStartDate,
    setEndDate,
    handleRangeDataFilter,
}: any) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [openRangeDataPicker, setOpenRangeDatePicker] = useState(false);
    const [start, setStart] = useState<any>();
    const [end, setEnd] = useState<any>();
    const [range, setRangeDate] = useState<any>();
    const { locale } = useSelector((state: RootState) => state.language);
    const [value, setValue] = useState<any>("145");
    useEffect(() => setStartDate(start), [start]);
    useEffect(() => setEndDate(end), [end]);
    useEffect(() => {
        setStartDate(range?.startDate);
        setStart(range?.startDate);
        setEndDate(range?.endDate);
        setEnd(range?.endDate);
    }, [range]);

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
            toValue: isKeyboardVisible ? 0 : 200, // Collapse on keyboard open, expand otherwise
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
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View className="flex-1 justify-start pt-20 bg-[#0a0a0aa8] bg-opacity-50">
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setOpenStartDate(false);
                            setOpenEndDate(false);
                        }}
                    >
                        <View className="bg-white mx-2 ">
                            {/* Period of Time */}
                            {showPeriodOfTime && showRangePicker ? (
                                <>
                                    <View className="flex-row justify-between p-3 bg-[#ebebeb]">
                                        <Text className="text-chartText font-bold text-lg ">
                                            Period of Time
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

                                    <View className="flex-row justify-between items-center m-4">
                                        <View className="flex-1 mr-2">
                                            <Text className=" text-chartText  mb-1 font-semibold">
                                                From
                                            </Text>
                                            <Pressable
                                                className=" bg-cardBg   px-2 py-3 flex-row justify-between"
                                                onPress={() =>
                                                    setOpenRangeDatePicker(
                                                        !openRangeDataPicker
                                                    )
                                                }
                                            >
                                                <Text className="text-slate-600">
                                                    {/* {start
														? dayjs(start)
															  .locale("en")
															  .format(
																  "MMM DD YYYY"
															  )
														: dayjs()
															  .locale("en")
															  .format(
																  "MMM DD YYYY"
															  )} */}
                                                    {start
                                                        ? dayjs(start)
                                                              .locale(locale)
                                                              .format(
                                                                  locale ===
                                                                      "en"
                                                                      ? "DD/MM/YYYY"
                                                                      : "DD.MM.YYYY"
                                                              )
                                                        : dayjs()
                                                              .locale(locale)
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
                                                className=" bg-disableCard  px-2 py-3 flex-row justify-between"
                                                // onPress={() => setOpenStartDate(!openStartDate)}
                                            >
                                                <Text className="text-[#616161]">
                                                    {/* {start
														? dayjs(start)
															  .locale("en")
															  .format("HH:mm")
														: dayjs()
															  .locale("en")
															  .format("HH:mm")} */}
                                                    00:00
                                                </Text>
                                                <Ionicons
                                                    name="alarm-outline"
                                                    size={20}
                                                    color="#696969"
                                                />
                                            </Pressable>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between items-center m-4">
                                        <View className="flex-1 mr-2">
                                            <Text className="text-chartText mb-1">
                                                To
                                            </Text>
                                            <Pressable
                                                className=" bg-cardBg  px-2 py-3 flex-row justify-between"
                                                onPress={() =>
                                                    setOpenRangeDatePicker(
                                                        !openRangeDataPicker
                                                    )
                                                }
                                            >
                                                <Text className="text-slate-600">
                                                    {end
                                                        ? dayjs(end)
                                                              .locale(locale)
                                                              .format(
                                                                  locale ===
                                                                      "en"
                                                                      ? "DD/MM/YYYY"
                                                                      : "DD.MM.YYYY"
                                                              )
                                                        : dayjs()
                                                              .locale(locale)
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
                                        <View className="flex-1 ml-2 ">
                                            <Text className="text-gray-400 mb-1">
                                                {" "}
                                                {""}
                                            </Text>
                                            <Pressable
                                                className="bg-disableCard  px-2 py-3 flex-row justify-between"
                                                // onPress={() => setOpenStartDate(!openStartDate)}
                                            >
                                                <Text className="text-[#616161]">
                                                    {/* {end
														? dayjs(end)
															  .locale("en")
															  .format("HH:mm")
														: dayjs()
															  .locale("en")
															  .format("HH:mm")} */}
                                                    00:00
                                                </Text>
                                                <Ionicons
                                                    name="alarm-outline"
                                                    size={20}
                                                    color="#696969"
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View className="flex-row justify-between p-3 bg-[#ebebeb]">
                                        <Text
                                            className="text-chartText font-bold text-lg "
                                            onPress={() => {
                                                setKeyboardVisible(false);
                                                Keyboard.dismiss();
                                            }}
                                        >
                                            Period of Time
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
                                        }}
                                    >
                                        <View className="flex-row justify-between items-center m-4">
                                            <View className="flex-1 mr-2">
                                                <Text className=" text-chartText  mb-1 font-semibold">
                                                    From
                                                </Text>
                                                <Pressable
                                                    className=" bg-cardBg  p-3 flex-row justify-between"
                                                    onPress={() =>
                                                        setOpenStartDate(
                                                            !openStartDate
                                                        )
                                                    }
                                                >
                                                    <Text className="text-slate-700">
                                                        {start
                                                            ? dayjs(start)
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
                                                    onPress={() =>
                                                        setOpenStartDate(
                                                            !openStartDate
                                                        )
                                                    }
                                                >
                                                    <Text className="text-slate-700">
                                                        {start
                                                            ? dayjs(start)
                                                                  .locale("en")
                                                                  .format(
                                                                      "HH:mm"
                                                                  )
                                                            : dayjs()
                                                                  .locale("en")
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
                                        <View className="flex-row justify-between items-center m-4">
                                            <View className="flex-1 mr-2">
                                                <Text className=" text-chartText  mb-1 font-semibold">
                                                    To
                                                </Text>
                                                <Pressable
                                                    className="bg-cardBg  p-3 flex-row justify-between"
                                                    onPress={() =>
                                                        setOpenEndDate(
                                                            !openEndDate
                                                        )
                                                    }
                                                >
                                                    <Text className="text-slate-700">
                                                        {end
                                                            ? dayjs(end)
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
                                                    {""}
                                                </Text>
                                                <Pressable
                                                    className="bg-cardBg  p-3 flex-row justify-between"
                                                    onPress={() =>
                                                        setOpenStartDate(
                                                            !openStartDate
                                                        )
                                                    }
                                                >
                                                    <Text className="text-slate-700">
                                                        {end
                                                            ? dayjs(end)
                                                                  .locale("en")
                                                                  .format(
                                                                      "HH:mm"
                                                                  )
                                                            : dayjs()
                                                                  .locale("en")
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
                                <>
                                    <Text className="text-chartText font-bold text-lg p-3 bg-[#ebebeb]">
                                        Value Range
                                    </Text>
                                    <View className="flex-col  m-4">
                                        <View className="mr-2 mb-2 w-[50%]">
                                            <Text className=" text-chartText  mb-1 font-semibold">
                                                From
                                            </Text>

                                            <View>
                                                <TextInput
                                                    className=" bg-cardBg text-slate-700 p-3"
                                                    placeholder=""
                                                    value={value}
                                                    onChangeText={(text) => {
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
                                        <View className="mr-2 mb-2 w-[50%]">
                                            <Text className=" text-chartText  mb-1 font-semibold">
                                                To
                                            </Text>
                                            <View>
                                                <TextInput
                                                    className=" bg-cardBg text-slate-700 p-3"
                                                    placeholder=""
                                                    value={value}
                                                    onChangeText={(text) => {
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
                                </>
                            )}
                            <View className="flex-row justify-end my-3">
                                <Pressable
                                    className="px-4 py-2"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text className="text-chartText  font-bold">
                                        Cancle
                                    </Text>
                                </Pressable>
                                <Pressable
                                    className="px-4 py-2"
                                    onPress={() => {
                                        handleRangeDataFilter();
                                        setTimeout(() => {
                                            setModalVisible(false);
                                        }, 100);
                                    }}
                                >
                                    <Text className="text-red-600 font-extrabold">
                                        OK
                                    </Text>
                                </Pressable>
                            </View>
                            {openStartDate && (
                                <View className="absolute z-50 inset-0 flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8]">
                                    <DateTimePickerComponents
                                        title="Select Start Date"
                                        open={openStartDate}
                                        timePicker={true}
                                        setOpen={setOpenStartDate}
                                        setSingleDate={setStart}
                                    />
                                </View>
                            )}
                            {openEndDate && (
                                <View className="absolute z-50 inset-0 flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8] ">
                                    <DateTimePickerComponents
                                        title="Select End Date"
                                        open={openEndDate}
                                        timePicker={true}
                                        setOpen={setOpenEndDate}
                                        setSingleDate={setEnd}
                                    />
                                </View>
                            )}
                            {openRangeDataPicker && (
                                <View className="absolute z-50 inset-0  flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8] ">
                                    <DateTimePickerComponents
                                        title="Select Date Range"
                                        pickerMode="range"
                                        open={openRangeDataPicker}
                                        timePicker={false}
                                        setOpen={setOpenRangeDatePicker}
                                        setRangeDate={setRangeDate}
                                    />
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
export default PickerModel;
