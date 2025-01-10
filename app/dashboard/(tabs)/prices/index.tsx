import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import React, { act, memo, useEffect } from "react";
import { PricesItem } from "@/constants/constantData";
import { Href } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

const Prices = () => {
    const router = useRouter();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const ListItem = memo(({ item }: any) => (
        <TouchableOpacity
            key={item.id}
            className="flex flex-row justify-between items-center w-auto p-3 px-1 pl-4 rounded-sm font-medium my-1  bg-white h-20 shadow-xl shadow-gray-500 mx-2"
            onPress={() => {
                dispatch(activeLoading());

                setTimeout(() =>
                    router.push(`dashboard/prices/${item.id}` as Href)
                );
            }}
        >
            <View className="flex flex-row items-center justify-start">
                <Text className="text-listText mr-2 text-sm">{item.title}</Text>
            </View>
            <View className="flex flex-row items-center justify-start">
                <Text className="font-sans font-extralight text-listText text-xs ">
                    {item.unit} € / MWh
                </Text>
            </View>

            <FontAwesome5
                name={
                    item.indicator === "up"
                        ? "long-arrow-alt-up"
                        : item.indicator === "down"
                        ? "long-arrow-alt-down"
                        : "long-arrow-alt-right"
                }
                size={24}
                color={
                    item.indicator === "up"
                        ? "#71D500"
                        : item.indicator === "down"
                        ? "red"
                        : "gray"
                }
                style={{
                    margin: 1,
                    transform:
                        item.indicator === "up" || item.indicator === "down"
                            ? [{ rotate: "45deg" }]
                            : [],
                }}
                className="mr-2"
            />
        </TouchableOpacity>
    ));
    const renderItem = ({ item }: any) => <ListItem item={item} />;
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    return (
        <SafeAreaView>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View className="h-auto">
                <View className="top-0 w-[100%] p-5 z-50 flex flex-row rounded-sm justify-between bg-[#e31837] ">
                    <View className="flex flex-col justify-evenly w-[60%]">
                        <Text className="flex justify-start font-normal mb-2  items-center   text-xl  text-white">
                            EEX Power Auction
                        </Text>
                        <Text className="flex justify-start font-normal items-center  text-sm  text-white">
                            24/07/5468
                        </Text>
                    </View>

                    <View className="flex justify-center items-center w-[10%] mb-4">
                        <Ionicons
                            name="settings-sharp"
                            size={30}
                            color="white"
                            onPress={() => {
                                dispatch(activeLoading());

                                setTimeout(() =>
                                    router.push("/dashboard/prices/settings")
                                );
                            }}
                        />
                    </View>
                </View>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={PricesItem}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index) => index.toString()}
                    scrollEnabled={true}
                    className="overflow-scroll "
                    contentContainerStyle={{ paddingTop: 4 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default Prices;
