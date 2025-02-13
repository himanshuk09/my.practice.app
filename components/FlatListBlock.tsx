import React, { memo, useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Platform,
	Animated,
	Easing,
	RefreshControl,
} from "react-native";
import { Href, Link, usePathname, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
import { FontAwesome } from "@expo/vector-icons";
import { st } from "@/utils/Styles";
import { ShimmerFlatListBlock } from "./ShimmerEffect";
import Portfolio from "./SVG/Portfolio";

const FlatListBlock = ({
	title,
	items,
	enableAutoScroll = true,
	height = "100%",
	keyExtractor,
	NavigateTo,
	renderType,
}: any) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const flatListRef = useRef<any>(null);
	const currentYear = new Date().getFullYear();
	const ITEM_HEIGHT = Platform.OS === "web" ? 83 : 72.8;
	const isFocused = useIsFocused();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const currentRoute = usePathname(); // Provides the current route path
	const previousRouteRef = useRef<string | null>(null);
	const previousRoute: any = previousRouteRef.current;
	const ListItem = memo(({ item, router }: any) => (
		<TouchableOpacity
			key={item.id}
			className="flex justify-start flex-row px-5  py-6  text-lg font-serif font-medium rounded-sm my-1  mx-2 bg-white h-[4.7rem] "
			style={st.boxShadow}
			onPress={() => {
				dispatch(activeLoading());

				setTimeout(() => {
					router.push(`${NavigateTo}/${item.id}` as Href);
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
			<Text className="text-listText text-sm">{item?.title}</Text>
		</TouchableOpacity>
	));
	const PFCListItem = memo(({ item, router }: any) => (
		<TouchableOpacity
			key={item.id}
			className="flex justify-start flex-row px-5  py-6  text-lg font-serif font-medium rounded-sm my-1  mx-2 bg-white h-[4.7rem] "
			style={st.boxShadow}
			onPress={() => {
				dispatch(activeLoading());

				setTimeout(() => {
					router.push(`${NavigateTo}/1` as Href);
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
			<Text className="text-listText text-sm">
				{item?.PriceForwardCurveName}
			</Text>
		</TouchableOpacity>
	));
	const PortfolioListItem = memo(({ item, router }: any) => (
		<TouchableOpacity
			key={item.id}
			className="flex justify-start flex-row px-5  py-6  text-lg font-serif font-medium rounded-sm my-1  mx-2 bg-white h-[4.7rem] "
			style={st.boxShadow}
			onPress={() => {
				dispatch(activeLoading());
				setTimeout(() => {
					router.push({
						pathname: `dashboard/(tabs)/portfolio/[id]`,
						params: {
							id: encodeURIComponent(JSON.stringify(item)),
						},
					});
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
			<Text className="text-listText text-sm">
				{item?.PortfolioName}
			</Text>
		</TouchableOpacity>
	));
	const onRefresh = async () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setIsRefreshing(false);
		}, 2000);
	};
	const renderItem = ({ item }: any) =>
		renderType === "Portfolio" ? (
			<PortfolioListItem item={item} router={router} />
		) : renderType === "pfc" ? (
			<PFCListItem item={item} router={router} />
		) : (
			<ListItem item={item} router={router} />
		);

	useEffect(() => {
		previousRouteRef.current = currentRoute;
	}, [currentRoute]);

	useEffect(() => {
		if (/^\/dashboard\/portfolio\/.+%/.test(previousRoute)) return;
		if (enableAutoScroll && flatListRef.current && isFocused) {
			const targetIndex = items.findIndex(
				(item: any) =>
					new Date(item.PortfolioDate).getFullYear() ===
					Number(currentYear)
			);

			if (targetIndex !== -1) {
				// Scroll to the first matched item (current year)
				const offset = targetIndex * ITEM_HEIGHT;

				const scrollValue = new Animated.Value(0); // Start with 0

				setTimeout(() => {
					try {
						// Animate the scrolling smoothly
						Animated.timing(scrollValue, {
							toValue: offset, // Scroll target offset
							duration: 800, // Duration in milliseconds
							easing: Easing.out(Easing.linear), // Smooth easing function
							useNativeDriver: Platform.OS != "web", // Disable for scrolling animations
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
				});
			}
		}
	}, [items, enableAutoScroll, currentYear, isFocused, items?.length <= 0]);

	return items?.length <= 0 ? (
		<ShimmerFlatListBlock />
	) : (
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
				keyExtractor={
					keyExtractor || ((item, index) => index.toString())
				}
				getItemLayout={(data, index) => ({
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index,
					index,
				})}
				initialNumToRender={40}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						colors={["#e31837"]} // Optional: Set colors for the refresh indicator
					/>
				}
				windowSize={40} // Reduce the number of items kept in memory
				maxToRenderPerBatch={40} // Render 10 items per batch
				updateCellsBatchingPeriod={50} // Batch updates to reduce re-renders
				removeClippedSubviews={
					Platform.OS === "android" ? false : true
				}
			/>
		</View>
	);
};

export default FlatListBlock;
