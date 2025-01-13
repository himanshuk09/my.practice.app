import { AntDesign } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    LayoutAnimation,
} from "react-native";
import Collapsible from "react-native-collapsible";

export const Accordion = ({ data, startLoader }: any) => {
    const [activeItem, setActiveItem] = useState(null);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();
    const toggleItem = (itemIndex: any, headerIndex: any) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Smooth animation
        setActiveItem((prevItem) =>
            prevItem === itemIndex ? null : itemIndex
        );

        // Validate the headerIndex before scrolling
        if (headerIndex < data.length) {
            flatListRef.current?.scrollToIndex({
                index: headerIndex,
                animated: true,
                viewPosition: 0.5, // Center the item on the screen
            });
        }
    };

    const renderSubItem = ({ item, index }: any, headerIndex: any) => (
        <View>
            {/* Subitem Title */}
            <TouchableOpacity
                onPress={() => toggleItem(item.id, headerIndex)}
                className="flex flex-row justify-between items-center p-4 mx-2 text-lg font-serif font-medium rounded-sm my-1 shadow-slate-600 shadow-xl bg-white space-x-1 h-20"
                activeOpacity={0.6}
            >
                <Text className="text-listText w-[95%] text-base font-normal">
                    {item.title}
                </Text>
                <AntDesign
                    name={activeItem === item.id ? "caretup" : "caretdown"}
                    size={10}
                    color="#484848"
                />
            </TouchableOpacity>

            {/* Collapsible Section */}
            <Collapsible
                collapsed={activeItem !== item.id}
                duration={250}
                easing={"easeOutCubic"}
            >
                {item?.details.length > 0 ? (
                    item.details.map((detail: any, index: any) => (
                        <TouchableOpacity
                            key={index}
                            className="my-1 bg-accordionBg shadow-slate-200 shadow-lg pl-4 items-start justify-center rounded-sm text-center border-y-4 border-y-white h-20"
                            onPress={() => {
                                startLoader();
                                setTimeout(() =>
                                    router.push(
                                        `/dashboard/loaddata/${item?.id}/${detail?.id}` as Href
                                    )
                                );
                            }}
                        >
                            <Text className="text-md font-normal break-words  text-listText">
                                {detail.channel}
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
            </Collapsible>
        </View>
    );

    const renderHeader = ({ item, index }: any) => (
        <View>
            {/* Header */}
            <View className="w-full p-3 bg-[#e31837]">
                <Text className="flex justify-start font-normal py-2 p-3 items-center mb-4 h-14 text-xl rounded-sm text-white">
                    {item.header}
                </Text>
            </View>

            {/* Subitems */}
            <FlatList
                data={item.data}
                keyExtractor={(subItem) => subItem.id.toString()}
                renderItem={(subItem) => renderSubItem(subItem, index)}
                scrollEnabled={false} // Prevent nested scrolling
            />
        </View>
    );

    return (
        <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item.header}
            renderItem={(header) => renderHeader(header)}
            showsVerticalScrollIndicator={false}
        />
    );
};

// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     Animated,
//     Platform,
// } from "react-native";
// import React, { useRef, useState } from "react";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { Href, useRouter } from "expo-router";

// const AccordionFlatlist = ({ data, title, startLoader }: any) => {
//     const [expanded, setExpanded] = useState(null);
//     const animations = useRef<any>({}).current;
//     const router = useRouter();
//     data?.forEach((item: any) => {
//         if (!animations[item.id]) {
//             animations[item.id] = new Animated.Value(0);
//         }
//     });

//     const toggleExpand = (id: any, detailsLength: any) => {
//         const animation = animations[id];

//         if (expanded === id) {
//             // Collapse the currently expanded item
//             Animated.timing(animation, {
//                 toValue: 0,
//                 duration: 300,
//                 useNativeDriver: false,
//             }).start(() => setExpanded(null));
//         } else {
//             // Collapse all open accordions
//             Object.keys(animations).forEach((key) => {
//                 if (animations[key]) {
//                     Animated.timing(animations[key], {
//                         toValue: 0,
//                         duration: 300,
//                         useNativeDriver: false,
//                     }).start();
//                 }
//             });
//             const baseValue = detailsLength > 0 ? detailsLength * 78 : 40;
//             // Expand the clicked accordion
//             Animated.timing(animation, {
//                 toValue: Platform.select({
//                     ios: baseValue + 20, // iOS-specific value
//                     android: baseValue, // Android-specific value
//                     default: baseValue + 35, // Default for other platforms or if no platform-specific values
//                 }),
//                 duration: 700,
//                 useNativeDriver: false,
//             }).start(() => setExpanded(id));
//         }
//     };
//     const renderItem = ({ item }: any) => {
//         const isExpanded = expanded === item.id;
//         const animation = animations[item.id];

//         return (
//             <View>
//                 <TouchableOpacity
//                     onPress={() => toggleExpand(item.id, item.details.length)}
//                     className="flex flex-row justify-between items-center p-4 mx-2 text-lg font-serif font-medium rounded-sm my-1  shadow-slate-600 shadow-xl bg-white space-x-1 h-20 "
//                     activeOpacity={0.6}
//                 >
//                     <Text className="text-listText w-[95%] text-base  font-normal">
//                         {item.title}
//                     </Text>
//                     <AntDesign
//                         name={isExpanded ? "caretup" : "caretdown"}
//                         size={10}
//                         color="#484848"
//                     />
//                 </TouchableOpacity>

//                 <Animated.View
//                     style={{
//                         height: animation,
//                         overflow: "hidden",
//                     }}
//                 >
//                     {item?.details.length > 0 ? (
//                         item?.details.map((detail: any, index: any) => (
//                             <TouchableOpacity
//                                 key={index}
//                                 className="my-1 bg-accordionBg shadow-slate-200 shadow-lg p-3  items-center justify-center  rounded-sm text-center border-y-4 border-y-white h-20"
//                                 onPress={() => {
//                                     startLoader();
//                                     // setTimeout(() => router.push(detail.route as Href));
//                                     setTimeout(() =>
//                                         router.push(
//                                             `/dashboard/loaddata/${item?.id}/${detail?.id}` as Href
//                                         )
//                                     );

//                                     console.log(item?.id);
//                                 }}
//                             >
//                                 <Text className="text-md font-normal text-listText">
//                                     {detail?.channel}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))
//                     ) : (
//                         <View className="pl-3 py-2 bg-[#f1f3f5] rounded-sm">
//                             <Text className="text-[#adb5bd] italic">
//                                 No channels available ...
//                             </Text>
//                         </View>
//                     )}
//                 </Animated.View>
//             </View>
//         );
//     };

//     return (
//         <>
//             <View className="w-full  p-3 bg-[#e31837] ">
//                 <Text className="flex justify-start font-normal  py-2 p-3  items-center mb-4  h-14 text-xl rounded-sm text-white">
//                     {title}
//                 </Text>
//             </View>
//             <FlatList
//                 showsHorizontalScrollIndicator={false}
//                 showsVerticalScrollIndicator={false}
//                 data={data}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 contentContainerStyle={{
//                     padding: 10,
//                 }}
//             />
//         </>
//     );
// };

// export default AccordionFlatlist;
