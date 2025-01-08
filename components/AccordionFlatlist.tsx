import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Href, useRouter } from "expo-router";

const AccordionFlatlist = ({ data, title, startLoader }: any) => {
  const [expanded, setExpanded] = useState(null);
  const animations = useRef<any>({}).current;
  const router = useRouter();
  data?.forEach((item: any) => {
    if (!animations[item.id]) {
      animations[item.id] = new Animated.Value(0);
    }
  });

  const toggleExpand = (id: any, detailsLength: any) => {
    const animation = animations[id];

    if (expanded === id) {
      // Collapse the currently expanded item
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpanded(null));
    } else {
      // Collapse all open accordions
      Object.keys(animations).forEach((key) => {
        if (animations[key]) {
          Animated.timing(animations[key], {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      });
      const baseValue = detailsLength > 0 ? detailsLength * 78 : 40;
      // Expand the clicked accordion
      Animated.timing(animation, {
        toValue: Platform.select({
          ios: baseValue + 20, // iOS-specific value
          android: baseValue, // Android-specific value
          default: baseValue + 35, // Default for other platforms or if no platform-specific values
        }),
        duration: 700,
        useNativeDriver: false,
      }).start(() => setExpanded(id));
    }
  };
  const renderItem = ({ item }: any) => {
    const isExpanded = expanded === item.id;
    const animation = animations[item.id];

    return (
      <View>
        <TouchableOpacity
          onPress={() => toggleExpand(item.id, item.details.length)}
          className="flex flex-row justify-between items-center p-4 text-lg font-serif font-medium rounded-sm my-1  shadow-slate-60000 shadow-xl bg-white space-x-1 h-20 "
          activeOpacity={0.6}
        >
          <Text className="text-slate-500 w-[95%] text-base  font-normal">
            {item.title}
          </Text>
          <AntDesign
            name={isExpanded ? "caretup" : "caretdown"}
            size={15}
            color="#64748b"
          />
        </TouchableOpacity>

        <Animated.View
          style={{
            height: animation,
            overflow: "hidden",
          }}
        >
          {item?.details.length > 0 ? (
            item?.details.map((detail: any, index: any) => (
              <TouchableOpacity
                key={index}
                className="my-1 bg-gray-100 shadow-slate-200 shadow-lg p-3  items-center justify-center  rounded-sm text-center border-y-4 border-y-white h-20"
                onPress={() => {
                  startLoader();
                  // setTimeout(() => router.push(detail.route as Href));
                  setTimeout(() =>
                    router.push(
                      `/dashboard/loaddata/${item?.id}/${detail?.id}` as Href
                    )
                  );

                  console.log(item?.id);
                }}
              >
                <Text className="text-md font-normal text-gray-500">
                  {detail?.channel}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View className="pl-3 py-2 bg-[#f1f3f5] rounded-sm">
              <Text className="text-[#adb5bd] italic">
                No channels available ...
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      <View className=" w-full  p-3 bg-[#e31837] ">
        <Text className="flex justify-start font-normal  py-2 p-3  items-center mb-4  h-14 text-xl rounded-sm text-white">
          {title}
        </Text>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 10,
        }}
        className=" bg-gray-100  overflow-scroll mx-0"
      />
    </>
  );
};

export default AccordionFlatlist;
