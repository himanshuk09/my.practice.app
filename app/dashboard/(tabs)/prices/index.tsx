import {
	View,
	Text,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	StatusBar,
	RefreshControl,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { PricesItem } from "@/constants/constantData";
import { Href } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { st } from "@/utils/Styles";
import { ShimmerPrices, ShimmerPricesHeader } from "@/components/ShimmerEffect";
import { i18n } from "@/localization/config";

const Prices = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [error, setError] = useState(false);
	const [prices, setPrices] = useState<any>([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const ListItem = memo(({ item }: any) => (
		<TouchableOpacity
			key={item.id}
			className="flex flex-row justify-between items-center w-auto p-3 px-1 pl-4  font-medium my-1  bg-white h-20  mx-2"
			style={st.boxShadow}
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
				className="mr-5"
			/>
		</TouchableOpacity>
	));
	const renderItem = ({ item }: any) =>
		prices?.length <= 0 ? <ShimmerPrices /> : <ListItem item={item} />;

	useEffect(() => {
		setTimeout(() => {
			setPrices(PricesItem);
		}, 1000);
		dispatch(inActiveLoading());
	}, [isFocused]);
	return (
		<SafeAreaView className="flex-1 bg-white">
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#C3C3C3"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{error ? (
				<View
					className="items-center justify-center "
					style={{
						height: "90%",
					}}
				>
					<Text className="text-md font-medium text-mainCardHeaderText">
						{i18n.t("Data_not_available")}
					</Text>
				</View>
			) : (
				<React.Fragment>
					{prices?.length <= 0 ? (
						<ShimmerPricesHeader />
					) : (
						<View className="top-0 w-[100%] p-5 z-50 flex flex-row rounded-sm justify-between bg-primary ">
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
											router.push(
												"/dashboard/prices/settings"
											)
										);
									}}
								/>
							</View>
						</View>
					)}

					<FlatList
						data={
							prices?.length <= 0
								? [...Array(10).keys()].map((index) => ({
										id: index,
										title: `Shimmer ${index}`,
										unit: 0,
										indicator: "Loading",
										route: "",
									}))
								: prices
						}
						renderItem={renderItem}
						keyExtractor={(item: any, index) => index.toString()}
						contentContainerStyle={{ paddingTop: 4 }}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={() => setIsRefreshing(false)}
								colors={["#e31837"]} // Optional: Set colors for the refresh indicator
							/>
						}
					/>
				</React.Fragment>
			)}
		</SafeAreaView>
	);
};

export default Prices;
