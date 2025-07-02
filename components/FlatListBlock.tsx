import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Platform,
	Animated,
	Easing,
} from "react-native";
import { st } from "@/utils/Styles";
import { useDispatch } from "react-redux";
import Title from "@/components//ui/Title";
import { ROUTEKEYS } from "@/utils/messages";
import { FontAwesome } from "@expo/vector-icons";
import { ScreenNameEnum } from "@/types/chart.type";
import { useIsFocused } from "@react-navigation/native";
import { activeLoading } from "@/store/navigationSlice";
import { Router, usePathname, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useRef } from "react";

import { ShimmerFlatListBlock } from "./ListShimmer";

interface FlatListBlockProps<T = any> {
	title: string;
	items: T[];
	enableAutoScroll?: boolean;
	height?: number | string | any;
	keyExtractor?: (item: T, index: number | string) => string;
	renderType: ScreenNameEnum;
}

const FlatListBlock = <T,>({
	title,
	items,
	enableAutoScroll = false,
	height = "100%",
	keyExtractor,
	renderType,
}: FlatListBlockProps<T>) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const currentRoute = usePathname(); // Provides the current route path
	const flatListRef = useRef<FlatList>(null);
	const currentYear = new Date().getFullYear();
	const previousRouteRef = useRef<string>("");
	const ITEM_HEIGHT = Platform.OS === "web" ? 83 : 72.8;
	const previousRoute: string = previousRouteRef.current;

	const ListItem = memo(
		({
			item,
			router,
			renderType,
			index,
		}: {
			item: any;
			router: Router;
			renderType: ScreenNameEnum;
			index: number | string;
		}) => {
			const handlePress = () => {
				dispatch(activeLoading());

				requestAnimationFrame(() => {
					if (renderType === ScreenNameEnum.PORTFOLIO) {
						router.push({
							pathname: ROUTEKEYS.PORTFOLIO_ID,
							params: {
								id: encodeURIComponent(JSON.stringify(item)),
							},
						});
					} else if (renderType === ScreenNameEnum.PFC) {
						router.push({
							pathname: ROUTEKEYS.PFC_ID,
							params: {
								id: 1,
							},
						});
					} else if (renderType === ScreenNameEnum.SIGNALS) {
						router.push({
							pathname: ROUTEKEYS.SIGNALS_ID,
							params: {
								id: 1,
							},
						});
					}
				});
			};

			const title =
				renderType === ScreenNameEnum.PORTFOLIO
					? item?.PortfolioName
					: renderType === ScreenNameEnum.PFC
						? item?.PriceForwardCurveName
						: item?.title;

			return (
				<TouchableOpacity
					key={item.id}
					className="flex justify-start items-center flex-row  text-lg font-serif font-medium rounded-sm my-1 mx-2 bg-white h-[4.7rem] pl-5"
					//h-[4.7rem]
					style={st.boxShadow}
					onPress={handlePress}
				>
					{item?.notificationCount && (
						<FontAwesome
							name="circle"
							size={8}
							color="#e31837"
							className="mr-1 mt-[0.4rem]"
						/>
					)}
					<Text className="text-listText  text-sm">{title}</Text>
				</TouchableOpacity>
			);
		}
	);

	const renderItem = useCallback(
		({ item, index }: { item: T; index: number }) => (
			<ListItem
				item={item}
				router={router}
				renderType={renderType}
				index={index}
			/>
		),
		[renderType]
	);

	useEffect(() => {
		previousRouteRef.current = currentRoute;
	}, [currentRoute]);

	const scrollY = useRef(0);
	useEffect(() => {
		if (
			/^\/dashboard\/portfolio\/.+%/.test(previousRoute) ||
			items?.length <= 0
		) {
			return;
		}

		if (enableAutoScroll && flatListRef.current && isFocused) {
			const targetIndex = items.findIndex((item: any) => {
				const year = new Date(item.PortfolioDate).getFullYear();
				return year === currentYear;
			});

			if (targetIndex === -1 || targetIndex <= 1) return;

			const targetOffset = targetIndex * ITEM_HEIGHT;
			const currentOffset = scrollY.current;

			//  Skip if already within 10px of target offset
			if (Math.abs(currentOffset - targetOffset) < 10) {
				// Already near target, skipping scroll
				return;
			}

			const scrollAnim = new Animated.Value(currentOffset);

			const listenerId = scrollAnim.addListener(({ value }) => {
				flatListRef.current?.scrollToOffset({
					offset: value,
					animated: false,
				});
			});

			Animated.timing(scrollAnim, {
				toValue: targetOffset,
				duration: 1200,
				easing: Easing.inOut(Easing.cubic),
				useNativeDriver: false,
			}).start(() => {
				scrollAnim.removeListener(listenerId);
			});
		}
	}, [items]);
	return items?.length <= 0 ? (
		<ShimmerFlatListBlock height={height} />
	) : (
		<View
			style={{
				flex: 1,
				height: height ?? undefined,
			}}
		>
			<Title title={title} />

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
				windowSize={40} // Reduce the number of items kept in memory
				maxToRenderPerBatch={20} // Render 10 items per batch
				updateCellsBatchingPeriod={50} // Batch updates to reduce re-renders
				contentContainerStyle={{
					paddingBottom: 40,
				}}
				onScroll={(event) => {
					// for one time scroll
					scrollY.current = event.nativeEvent.contentOffset.y;
				}}
				scrollEventThrottle={16}
			/>
		</View>
	);
};

export default FlatListBlock;

// useEffect(() => {
// 	if (
// 		/^\/dashboard\/portfolio\/.+%/.test(previousRoute) ||
// 		items?.length <= 0
// 	) {
// 		return;
// 	}

// 	if (enableAutoScroll && flatListRef.current && isFocused) {
// 		const targetIndex = items.findIndex(
// 			(item: any) =>
// 				new Date(item.PortfolioDate).getFullYear() ===
// 				Number(currentYear)
// 		);

// 		if (targetIndex !== -1) {
// 			const offset = targetIndex * ITEM_HEIGHT;
// 			const maxOffset = (items.length - 1) * ITEM_HEIGHT;
// 			const safeOffset = Math.min(offset, maxOffset);

// 			// Animated scroll value starts from current scroll position
// 			let currentOffset = 0;

// 			flatListRef.current?.scrollToOffset({
// 				offset: 0,
// 				animated: false,
// 			});

// 			const scrollAnim = new Animated.Value(0);

// 			// Keep track of current scroll offset
// 			const listenerId = scrollAnim.addListener(({ value }) => {
// 				flatListRef.current?.scrollToOffset({
// 					offset: value,
// 					animated: false,
// 				});
// 				currentOffset = value;
// 			});

// 			// Animate from 0 (or currentOffset) to safeOffset over 800ms
// 			Animated.timing(scrollAnim, {
// 				toValue: safeOffset,
// 				duration: 2000, // You can change this duration
// 				easing: Easing.out(Easing.cubic),
// 				useNativeDriver: false, // scrollToOffset needs false
// 			}).start(() => {
// 				scrollAnim.removeListener(listenerId);
// 			});
// 		}
// 	}
// }, [items, enableAutoScroll]);
