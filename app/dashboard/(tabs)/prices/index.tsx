import {
	View,
	Text,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import { st } from "@/utils/Styles";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { ROUTEKEYS } from "@/utils/messages";
import NoData from "@/components/icons/NoData";
import NoNetwork from "@/components/icons/NoNetwork";
import { PricesItem } from "@/constants/constantData";
import { useIsFocused } from "@react-navigation/native";
import React, { memo, useEffect, useState } from "react";
import { isIdRoute } from "@/app/dashboard/(tabs)/_layout";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { ShimmerPrices, ShimmerPricesHeader } from "@/components/ShimmerEffect";
import { RootState } from "@/store/store";
import { DATE_FORMAT_PATTERNS, englishLocale } from "@/localization/config";

const Prices = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [error, setError] = useState(false);
	const [prices, setPrices] = useState<any>(PricesItem);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const insets = useSafeAreaInsets();
	const { locale } = useSelector((state: RootState) => state.culture);
	const isEng = locale === englishLocale;
	const dateFormate = isEng
		? DATE_FORMAT_PATTERNS.DATE_SLASHED_DD_MM_YYYY
		: DATE_FORMAT_PATTERNS.DATE_DOTTED_DD_MM_YYYY;
	const ListItem = memo(({ item }: any) => (
		<TouchableOpacity
			key={item.id}
			className="flex flex-row justify-between items-center w-auto p-3 px-1 pl-4  font-medium my-1  bg-white h-20  mx-2"
			style={st.boxShadow}
			onPress={() => {
				dispatch(activeLoading());
				setTimeout(() =>
					router.push({
						pathname: ROUTEKEYS.PRICES_ID,
						params: { id: item.id },
					})
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
		loading ? <ShimmerPrices /> : <ListItem item={item} />;

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (prices.length === 0) return <NoData />;
	return (
		<SafeAreaView className="flex-1 bg-white">
			{loading ? (
				<ShimmerPricesHeader />
			) : (
				<View
					className="top-0 w-[100%] p-5 z-50 flex flex-row rounded-sm justify-between bg-primary"
					style={{
						marginTop: isIdRoute ? insets.top : 0,
					}}
				>
					<View className="flex flex-col justify-evenly w-[60%]">
						<Text className="flex justify-start font-normal mb-2  items-center   text-xl  text-white">
							EEX Power Auction
						</Text>
						<Text className="flex justify-start font-normal items-center  text-sm  text-white">
							{dayjs().locale(locale).format(dateFormate)}
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
									router.push(ROUTEKEYS.PRICES_SETTINGS)
								);
							}}
						/>
					</View>
				</View>
			)}
			<FlatList
				data={
					loading
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
				contentContainerStyle={{ paddingTop: 4, paddingBottom: 40 }}
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
		</SafeAreaView>
	);
};

export default Prices;
