import React, { memo, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Loader from "./Loader";
import { useIsFocused } from "@react-navigation/native";

const FlatListBlock1 = ({
  title,
  items,
  enableAutoScroll = true,
  height = "auto",
}: any) => {
  const router = useRouter();
  const flatListRef = useRef<any>(null);
  const currentYear = new Date().getFullYear();
  const ITEM_HEIGHT = Platform.OS === "web" ? 75 : 63;
  const isFocused = useIsFocused();
  const ListItem = memo(({ item, router }: any) => (
    <TouchableOpacity
      key={item.id}
      className="flex justify-start p-5 text-lg font-serif font-medium rounded-sm my-1 shadow-slate-400 shadow-lg bg-white h-20 space-x-1"
      onPress={() => item.route && router.push(item.route)}
    >
      <Text className="text-gray-500 text-base font-normal">{item.title}</Text>
    </TouchableOpacity>
  ));

  const renderItem = ({ item }: any) => (
    <ListItem item={item} router={router} />
  );

  useEffect(() => {
    if (enableAutoScroll && flatListRef.current && isFocused) {
      // Find the first index that matches the current year
      const targetIndex = items.findIndex(
        (item: any) => item.year === currentYear
      );

      if (targetIndex !== -1) {
        // Scroll to the first matched item (current year)
        const offset = (targetIndex + 1) * ITEM_HEIGHT + 20;

        setTimeout(() => {
          try {
            flatListRef.current.scrollToOffset({
              offset, // Scroll to the first matched index
              animated: true,
            });
          } catch (error) {
            console.warn("Scroll Error:", error);
          }
        }, 500);
        // const scrollOffset = new Animated.Value(0);
        // Animated.timing(scrollOffset, {
        //   toValue: offset,
        //   duration: 500, // Adjust the duration for slower scroll speed
        //   useNativeDriver: true,
        // }).start(() => {
        //   flatListRef.current.scrollToOffset({
        //     offset: offset, // Use the animated offset
        //     animated: true,
        //   });
        // });
      }
    }
  }, [items, enableAutoScroll, currentYear, isFocused]);

  if (items.length === 0) {
    return <Loader />;
  }

  return (
    <View
      className="my-1"
      style={{
        height: height,
      }}
    >
      <View className="top-0 w-[100%] z-50 p-3 bg-[#e31837]">
        <Text className="flex justify-start font-normal py-2 p-3 mb-4 items-center h-12 text-xl rounded-sm text-white">
          {title}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={10} // Ensure enough items render initially
        className="bg-gray-100 overflow-scroll mx-2"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FlatListBlock1;
