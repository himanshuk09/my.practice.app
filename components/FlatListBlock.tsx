import React, {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Platform,
	Animated,
	Easing,
} from "react-native";
import { Href, usePathname, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
import { FontAwesome } from "@expo/vector-icons";
import { st } from "@/utils/Styles";
import { ShimmerFlatListBlock } from "./ShimmerEffect";

const FlatListBlock = ({
	title,
	items,
	enableAutoScroll = false,
	height = "100%",
	keyExtractor,
	NavigateTo,
	renderType,
}: any) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const currentRoute = usePathname(); // Provides the current route path
	const flatListRef = useRef<any>(null);
	const currentYear = new Date().getFullYear();
	const previousRouteRef = useRef<string | null>(null);
	const ITEM_HEIGHT = Platform.OS === "web" ? 83 : 72.8;
	const previousRoute: any = previousRouteRef.current;

	const ListItem = memo(({ item, router, renderType, index }: any) => {
		const handlePress = () => {
			dispatch(activeLoading());

			setTimeout(() => {
				if (renderType === "Portfolio") {
					router.push({
						pathname: `dashboard/(tabs)/portfolio/[id]`,
						params: {
							id: encodeURIComponent(JSON.stringify(item)),
						},
					});
				} else if (renderType === "pfc") {
					router.push(`${NavigateTo}/1` as Href);
				} else {
					router.push(`${NavigateTo}/${index + 1}` as Href);
				}
			});
		};

		const title =
			renderType === "Portfolio"
				? item?.PortfolioName
				: renderType === "pfc"
					? item?.PriceForwardCurveName
					: item?.title;

		return (
			<TouchableOpacity
				key={item.id}
				className="flex justify-start flex-row px-5 py-6 text-lg font-serif font-medium rounded-sm my-1 mx-2 bg-white h-[4.7rem]"
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
				<Text className="text-listText text-sm">{title}</Text>
			</TouchableOpacity>
		);
	});

	const renderItem = useCallback(
		({ item, index }: any) => (
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

	useEffect(() => {
		if (
			/^\/dashboard\/portfolio\/.+%/.test(previousRoute) ||
			items?.length <= 0
		) {
			return;
		}

		if (enableAutoScroll && flatListRef.current && isFocused) {
			const targetIndex = items.findIndex(
				(item: any) =>
					new Date(item.PortfolioDate).getFullYear() ===
					Number(currentYear)
			);

			if (targetIndex !== -1) {
				const offset = targetIndex * ITEM_HEIGHT;
				const maxOffset = (items.length - 1) * ITEM_HEIGHT;
				const safeOffset = Math.min(offset, maxOffset);

				// Animated scroll value starts from current scroll position
				let currentOffset = 0;

				flatListRef.current?.scrollToOffset({
					offset: 0,
					animated: false,
				});

				const scrollAnim = new Animated.Value(0);

				// Keep track of current scroll offset
				const listenerId = scrollAnim.addListener(({ value }) => {
					flatListRef.current?.scrollToOffset({
						offset: value,
						animated: false,
					});
					currentOffset = value;
				});

				// Animate from 0 (or currentOffset) to safeOffset over 800ms
				Animated.timing(scrollAnim, {
					toValue: safeOffset,
					duration: 3000, // You can change this duration
					easing: Easing.out(Easing.cubic),
					useNativeDriver: false, // scrollToOffset needs false
				}).start(() => {
					scrollAnim.removeListener(listenerId);
				});
			}
		}
	}, [items, enableAutoScroll]);

	return items?.length <= 0 ? (
		<ShimmerFlatListBlock height={height} />
	) : (
		<View
			style={{
				flex: 1,
				height: height ?? undefined,
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
				windowSize={40} // Reduce the number of items kept in memory
				maxToRenderPerBatch={20} // Render 10 items per batch
				updateCellsBatchingPeriod={50} // Batch updates to reduce re-renders
				contentContainerStyle={{
					paddingBottom: 40,
				}}
			/>
		</View>
	);
};

export default FlatListBlock;
