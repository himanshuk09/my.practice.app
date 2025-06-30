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
import { ShimmerFlatListBlock } from "@/components/ListShimmer";
import { RootState } from "@/store/store";
import { englishLocale } from "@/localization/config";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";
import {
	DATE_FORMAT_PATTERNS,
	UNIT_PLACEHOLDER,
} from "@/utils/dateformatter.utils";

const Prices = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const insets = useSafeAreaInsets();
	const { locale } = useSelector((state: RootState) => state.culture);
	const isEng = locale === englishLocale;
	const dateFormate = isEng
		? DATE_FORMAT_PATTERNS.DATE_SLASHED_DD_MM_YYYY
		: DATE_FORMAT_PATTERNS.DATE_DOTTED_DD_MM_YYYY;
	const getPricesList = async () => {
		try {
			return await new Promise((resolve) => {
				setTimeout(() => {
					resolve(PricesItem);
				}, 2000);
			});
		} catch (error) {
			console.error("Error in getPricesList:", error);
			return;
			{
				prices: [];
			}
		}
	};

	const {
		data: pricesResponse,
		error: pricesError,
		loading: pricesLoading,
		isOnline,
		refetch,
	} = useNetworkAwareApiRequest(getPricesList, {
		autoFetch: true,
		enabled: isFocused,
		showGlobalLoader: false,
		deps: [isFocused],
	});
	const pricesList: any = pricesResponse || [];
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
					{item.unit}{" "}
					{UNIT_PLACEHOLDER.PLACEHOLDER_EURO_PER_MEGAWATT_HOUR_UNIT}
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
					transform:
						item.indicator === "up" || item.indicator === "down"
							? [{ rotate: "45deg" }]
							: [],
				}}
				className="mr-7"
			/>
		</TouchableOpacity>
	));

	useEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (pricesError) return <NoNetwork />;
	if (pricesList?.prices?.length === 0) return <NoData />;

	return pricesList?.length === 0 ? (
		<ShimmerFlatListBlock height={"100%"} pricesScreen={true} />
	) : (
		<SafeAreaView className="flex-1 bg-white">
			<View
				className="flex flex-row justify-between  bg-primary top-0 w-[100%] p-5 z-50 "
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
			<FlatList
				data={pricesList}
				renderItem={({ item }: any) => <ListItem item={item} />}
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
