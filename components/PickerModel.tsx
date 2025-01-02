import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePickerComponents from "./DateTimePickerComponents";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [openRangeDataPicker, setOpenRangeDatePicker] = useState(false);
  const [start, setStart] = useState<any>();
  const [end, setEnd] = useState<any>();
  const [range, setRangeDate] = useState<any>();

  useEffect(() => setStartDate(start), [start]);
  useEffect(() => setEndDate(end), [end]);
  useEffect(() => {
    setStartDate(range?.startDate);
    setStart(range?.startDate);
    setEndDate(range?.endDate);
    setEnd(range?.endDate);
  }, [range]);
  const handleBackgroundPress = () => {
    setModalVisible(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View className="flex-1 justify-start pt-24 bg-[#0a0a0aa8] bg-opacity-50">
          <TouchableWithoutFeedback
            onPress={() => {
              setOpenStartDate(false);
              setOpenEndDate(false);
            }}
          >
            <View className="bg-white mx-2 rounded-lg">
              {/* Period of Time */}
              {showPeriodOfTime && showRangePicker ? (
                <>
                  <View className="flex-row justify-between p-3 bg-[#ebebeb]">
                    <Text className="text-gray-600 font-bold text-lg ">
                      Period of Time
                    </Text>
                    <TouchableOpacity
                      className="m-1"
                      onPress={() => setModalVisible(!modalVisible)}
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
                      <Text className=" text-gray-400  mb-1 font-semibold">
                        From
                      </Text>
                      <Pressable
                        className="border border-gray-300 rounded px-2 py-2 flex-row justify-between"
                        onPress={() =>
                          setOpenRangeDatePicker(!openRangeDataPicker)
                        }
                      >
                        <Text className="text-slate-600">
                          {start
                            ? dayjs(start).locale("en").format("MMM DD YYYY")
                            : dayjs().locale("en").format("MMM DD YYYY")}
                        </Text>
                        <FontAwesome
                          name="calendar"
                          size={18}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                    <View className="flex-1 ml-2">
                      <Text className="text-gray-400 mb-1">00:00</Text>
                      <Pressable
                        className="border bg-slate-200 border-gray-300 rounded px-2 py-2 flex-row justify-between"
                        // onPress={() => setOpenStartDate(!openStartDate)}
                      >
                        <Text className="text-slate-600">
                          {start
                            ? dayjs(start).locale("en").format("HH:mm")
                            : dayjs().locale("en").format("HH:mm")}
                        </Text>
                        <Ionicons
                          name="alarm-outline"
                          size={22}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center m-4">
                    <View className="flex-1 mr-2">
                      <Text className="text-gray-400 mb-1">To</Text>
                      <Pressable
                        className="border  border-gray-300 rounded px-2 py-2 flex-row justify-between"
                        onPress={() =>
                          setOpenRangeDatePicker(!openRangeDataPicker)
                        }
                      >
                        <Text className="text-slate-600">
                          {end
                            ? dayjs(end).locale("en").format("MMM DD YYYY")
                            : dayjs().locale("en").format("MMM DD YYYY")}
                        </Text>
                        <FontAwesome
                          name="calendar"
                          size={18}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                    <View className="flex-1 ml-2 ">
                      <Text className="text-gray-400 mb-1">00:00</Text>
                      <Pressable
                        className="border bg-slate-200 border-gray-300 rounded p-2 flex-row justify-between"
                        // onPress={() => setOpenStartDate(!openStartDate)}
                      >
                        <Text className="text-slate-600">
                          {end
                            ? dayjs(end).locale("en").format("HH:mm")
                            : dayjs().locale("en").format("HH:mm")}
                        </Text>
                        <Ionicons
                          name="alarm-outline"
                          size={22}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-row justify-between p-3 bg-[#ebebeb]">
                    <Text className="text-gray-600 font-bold text-lg ">
                      Period of Time
                    </Text>
                    <TouchableOpacity
                      className="m-1"
                      onPress={() => setModalVisible(!modalVisible)}
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
                      <Text className=" text-gray-400  mb-1 font-semibold">
                        From
                      </Text>
                      <Pressable
                        className="border border-gray-300 rounded px-2 py-2 flex-row justify-between"
                        onPress={() => setOpenStartDate(!openStartDate)}
                      >
                        <Text className="text-slate-600">
                          {start
                            ? dayjs(start).locale("en").format("MMM DD YYYY")
                            : dayjs().locale("en").format("MMM DD YYYY")}
                        </Text>
                        <FontAwesome
                          name="calendar"
                          size={18}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                    <View className="flex-1 ml-2">
                      <Text className="text-gray-400 mb-1">00:00</Text>
                      <Pressable
                        className="border border-gray-300 rounded px-2 py-2 flex-row justify-between"
                        onPress={() => setOpenStartDate(!openStartDate)}
                      >
                        <Text className="text-slate-600">
                          {start
                            ? dayjs(start).locale("en").format("HH:mm")
                            : dayjs().locale("en").format("HH:mm")}
                        </Text>
                        <Ionicons
                          name="alarm-outline"
                          size={22}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center m-4">
                    <View className="flex-1 mr-2">
                      <Text className="text-gray-400 mb-1">To</Text>
                      <Pressable
                        className="border border-gray-300 rounded px-2 py-2 flex-row justify-between"
                        onPress={() => setOpenEndDate(!openEndDate)}
                      >
                        <Text className="text-slate-600">
                          {end
                            ? dayjs(end).locale("en").format("MMM DD YYYY")
                            : dayjs().locale("en").format("MMM DD YYYY")}
                        </Text>
                        <FontAwesome
                          name="calendar"
                          size={18}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                    <View className="flex-1 ml-2">
                      <Text className="text-gray-400 mb-1">00:00</Text>
                      <Pressable
                        className="border border-gray-300 rounded p-2 flex-row justify-between"
                        onPress={() => setOpenStartDate(!openStartDate)}
                      >
                        <Text className="text-slate-600">
                          {end
                            ? dayjs(end).locale("en").format("HH:mm")
                            : dayjs().locale("en").format("HH:mm")}
                        </Text>
                        <Ionicons
                          name="alarm-outline"
                          size={22}
                          color="#475569"
                        />
                      </Pressable>
                    </View>
                  </View>
                </>
              )}

              {/* Value Range */}
              {showValueRange && (
                <>
                  <Text className="text-gray-600 font-bold text-lg p-3 bg-[#ebebeb]">
                    Value Range
                  </Text>
                  <View className="flex-col  m-4">
                    <View className="mr-2 mb-2 w-[50%]">
                      <Text className="text-gray-400 mb-1">From </Text>
                      <TextInput
                        className="border border-gray-300 rounded px-2 py-2"
                        placeholder="877,456 kWh"
                        editable={false}
                      />
                    </View>
                    <View className="mr-2 mb-2 w-[50%]">
                      <Text className="text-gray-400 mb-1">To</Text>
                      <TextInput
                        className="border border-gray-300 rounded px-2 py-2"
                        placeholder="1632,418 kWh"
                        editable={false}
                      />
                    </View>
                  </View>
                </>
              )}
              <View className="flex-row justify-end my-3">
                <Pressable
                  className="px-4 py-2"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-600 font-bold">Cancle</Text>
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
                  <Text className="text-red-600 font-extrabold">OK</Text>
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
                <View className="absolute z-50 inset-0 flex flex-row justify-center  items-center m-auto bg-[#0a0a0aa8] ">
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
