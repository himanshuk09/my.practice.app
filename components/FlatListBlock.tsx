import React, { memo, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

const FlatListBlock = ({ title, items }: any) => {
  const router = useRouter();
  const flatListRef = useRef<any>(null);
  const currentYear = new Date().getFullYear();
  const isFocused = useIsFocused();
  const [isReady, setIsReady] = useState(false);
  const ITEM_HEIGHT = Platform.OS === "web" ? 73 : 63;

  useEffect(() => {
    // If the FlatList isn't ready or the ref is null, do nothing
    if (!isReady || !flatListRef.current) return;

    // Find the index of the current year item in the list
    const currentItemIndex = items.findIndex(
      (item: any) => item.year === currentYear
    );

    // If the current year item is found, perform smooth scrolling
    if (currentItemIndex !== -1) {
      let currentOffset = 0;
      const targetOffset = currentItemIndex * ITEM_HEIGHT; // Calculate the target scroll position
      const overshootOffset = targetOffset + 50; // Overshoot slightly for smoother effect

      // Function to perform smooth scrolling by incrementally scrolling to target offset
      const slowScroll = () => {
        if (flatListRef.current) {
          // Ensure FlatList ref is valid
          if (currentOffset < targetOffset - 5) {
            // If current offset is less than target, increment scroll position
            currentOffset += 10;
            flatListRef?.current?.scrollToOffset({
              offset: currentOffset, // Scroll by current offset
              animated: true, // Enable smooth animation
            });
            setTimeout(slowScroll, 40); // Call slowScroll again after 40ms to continue scrolling
          } else {
            // Once close to target offset, overshoot and then correct position
            flatListRef?.current?.scrollToOffset({
              offset: overshootOffset, // Overshoot slightly
              animated: true,
            });

            setTimeout(() => {
              // Correct position after overshooting
              flatListRef?.current?.scrollToOffset({
                offset: targetOffset, // Final target scroll position
                animated: true,
              });
            }, 500);
          }
        }
      };
      slowScroll();
    }
  }, [isReady, items, currentYear]);

  useEffect(() => {
    // Set 'isReady' flag to true once FlatList ref is available (mounted)
    if (flatListRef.current) {
      setIsReady(true); // Set the FlatList as ready to be scrolled
    }
  }, [flatListRef]); // Only run once when ref is available

  const ListItem = memo(({ item, router }: any) => (
    <TouchableOpacity
      key={item.id}
      className="flex justify-start p-5 text-lg font-serif font-medium rounded-sm my-1 shadow-slate-400 shadow-lg bg-white h-16"
      onPress={() => item.route && router.push(item.route)}
    >
      <Text className="text-gray-700">{item.title}</Text>
    </TouchableOpacity>
  ));

  const renderItem = ({ item }: any) => (
    <ListItem item={item} router={router} />
  );

  return (
    <View className="h-[49%] my-1">
      <View className="top-0 w-[100%] z-50 p-3 bg-[#e31837]">
        <Text className="flex justify-start font-semibold py-2 p-3 items-center h-12 text-xl rounded-sm text-white">
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
        className="bg-gray-100 overflow-scroll mx-2"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FlatListBlock;
//''''''''''''''''''
// import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
// import React, { memo, useEffect, useRef } from "react";
// import { Href, useRouter } from "expo-router";
// import { useIsFocused } from "@react-navigation/native";

// const FlatListBlock = ({ title, items }: any) => {
//   const router = useRouter();
//   const flatListRef = useRef<any>(null);
//   const currentYear = new Date().getFullYear();
//   const isFocused = useIsFocused();
//   const ITEM_HEIGHT = Platform.OS === "web" ? 73 : 63;
//   useEffect(() => {
//     const currentItemIndex = items.findIndex(
//       (item: any) => item.year === currentYear
//     );

//     if (currentItemIndex !== -1 && flatListRef.current) {
//       let currentOffset = 0;
//       const targetOffset = currentItemIndex * ITEM_HEIGHT;
//       const overshootOffset = targetOffset + 50;

//       const slowScroll = () => {
//         if (currentOffset < targetOffset - 5) {
//           currentOffset += 10;
//           flatListRef?.current.scrollToOffset({
//             offset: currentOffset,
//             animated: true,
//           });
//           setTimeout(slowScroll, 40);
//         } else {
//           flatListRef?.current.scrollToOffset({
//             offset: overshootOffset,
//             animated: true,
//           });

//           setTimeout(() => {
//             flatListRef?.current.scrollToOffset({
//               offset: targetOffset,
//               animated: true,
//             });
//           }, 500);
//         }
//       };

//       slowScroll();
//     }
//   }, [isFocused]);

//   const ListItem = memo(({ item, router }: any) => (
//     <TouchableOpacity
//       key={item.id}
//       className="flex justify-start p-5 text-lg font-serif font-medium rounded-sm my-1 shadow-slate-400 shadow-lg bg-white h-16"
//       onPress={() => item.route && router.push(item.route)}
//     >
//       <Text className="text-gray-700">{item.title}</Text>
//     </TouchableOpacity>
//   ));
//   const renderItem = ({ item }: any) => (
//     <ListItem item={item} router={router} />
//   );

//   return (
//     <View className="h-[49%]  my-1">
//       <View className="top-0 w-[100%] z-50 p-3 bg-[#e31837]">
//         <Text className="flex justify-start font-semibold  py-2 p-3  items-center  h-12 text-xl rounded-sm text-white">
//           {title}
//         </Text>
//       </View>
//       <FlatList
//         ref={flatListRef}
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         getItemLayout={(data, index) => ({
//           length: 60,
//           offset: 60 * index,
//           index,
//         })}
//         className=" bg-gray  overflow-scroll mx-2"
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default FlatListBlock;

//without bouncing list
// import { Href, useRouter } from "expo-router";
// import React, { useRef, useEffect } from "react";
// import {
//   Pressable,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";

// // Define types for your items
// interface Item {
//   id: string | number;
//   title: string;
//   year?: number;
//   route?: string;
// }

// interface FlatListBlockProps {
//   title: string;
//   items: Item[];
// }

// const FlatListBlock: React.FC<FlatListBlockProps> = ({ title, items }) => {
//   const router = useRouter();
//   const currentYear = new Date().getFullYear() + 2;
//   const flatListRef = useRef<FlatList<Item>>(null);

//   const scrollToYearIndex = items.findIndex(
//     (item) => item.year === currentYear
//   );

//   useEffect(() => {
//     if (scrollToYearIndex !== -1 && flatListRef.current) {
//       flatListRef.current.scrollToIndex({
//         index: scrollToYearIndex,
//         animated: true,
//       });
//     }
//   }, [scrollToYearIndex]);

//   const ITEM_HEIGHT = 50;

//   const getItemLayout = (
//     data: ArrayLike<Item> | null | undefined,
//     index: number
//   ) => ({
//     length: ITEM_HEIGHT,
//     offset: ITEM_HEIGHT * index,
//     index,
//   });

//   const onScrollToIndexFailed = (info: { index: number }) => {
//     const { index } = info;

//     if (index < 0) {
//       flatListRef.current?.scrollToIndex({ index: 0 });
//     } else {
//       flatListRef.current?.scrollToIndex({ index: items.length - 1 });
//     }
//   };
//   const renderItem = ({ item }: any) => (
//     <TouchableOpacity
//       key={item.id}
//       className="flex justify-start  p-5 text-lg font-serif font-medium rounded-sm my-1 shadow-slate-400  shadow-lg bg-white h-16 "
//       onPress={() => item.route && router.push(item.route as Href)}
//     >
//       <Text className="text-gray-700">{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="h-[50%]    my-1">
//       <View className="top-0 w-[100%] z-50 ">
//         <Text className="flex justify-start font-semibold  py-2 p-3  items-center bg-[#e31837] h-12 text-xl rounded-sm text-white">
//           {title}
//         </Text>
//       </View>
//       <FlatList
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         scrollEnabled={true}
//         className=" bg-gray  overflow-scroll mx-3"
//         getItemLayout={getItemLayout}
//         onScrollToIndexFailed={onScrollToIndexFailed}
//         ref={flatListRef}
//         contentContainerStyle={{ paddingTop: 10 }}
//       />
//     </View>
//   );
// };

// export default FlatListBlock;
