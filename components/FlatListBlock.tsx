import React, { memo, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Platform,
    Animated,
    Easing,
} from "react-native";
import { Href, useRouter } from "expo-router";
import Loader from "./Loader";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
import { Entypo, FontAwesome } from "@expo/vector-icons";

const FlatListBlock1 = ({
    title,
    items,
    enableAutoScroll = true,
    height = "auto",
    scrollHeight,
}: any) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const flatListRef = useRef<any>(null);
    const currentYear = new Date().getFullYear();
    const ITEM_HEIGHT = Platform.OS === "web" ? 75 : scrollHeight;
    const isFocused = useIsFocused();
    const ListItem = memo(({ item, router }: any) => (
        <TouchableOpacity
            key={item.id}
            className="flex justify-start flex-row px-5  py-6  text-lg font-serif font-medium rounded-sm my-1 shadow-2xl shadow-gray-500 mx-2 bg-white h-[4.7rem] "
            onPress={() => {
                dispatch(activeLoading());
                setTimeout(() => {
                    router.push(item.route as Href);
                });
            }}
        >
            {item?.notificationCount && (
                <FontAwesome
                    name="circle"
                    size={8}
                    color="#e31837"
                    className="mr-1 mt-[0.4rem]"
                />
            )}
            <Text className="text-listText text-sm">{item.title}</Text>
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

                const scrollValue = new Animated.Value(0); // Start with 0

                setTimeout(() => {
                    try {
                        // Animate the scrolling smoothly
                        Animated.timing(scrollValue, {
                            toValue: offset, // Scroll target offset
                            duration: 900, // Duration in milliseconds
                            easing: Easing.inOut(Easing.quad), // Smooth easing function
                            useNativeDriver: false, // Disable for scrolling animations
                        }).start();

                        // Attach the animation to the FlatList's scroll position
                        scrollValue.addListener(({ value }) => {
                            flatListRef.current?.scrollToOffset({
                                offset: value, // Update offset during animation
                                animated: false, // Manual control of animation
                            });
                        });
                    } catch (error) {
                        console.warn("Scroll Error:", error);
                    }
                }, 1000);
            }
        }
    }, [items, enableAutoScroll, currentYear, isFocused]);

    if (items.length === 0) {
        return <Loader />;
    }

    return (
        <View
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
                initialNumToRender={5}
                className=" overflow-scroll"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default FlatListBlock1;
