import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Animated,
	Platform,
} from "react-native";
import { st } from "@/utils/Styles";
import { useRouter } from "expo-router";
import Title from "@/components//ui/Title";
import { ROUTEKEYS } from "@/utils/messages";
import React, { useEffect, useRef } from "react";
import { Fontisto } from "@expo/vector-icons";
import { ShimmerAccordion } from "./ListShimmer";

interface AccordionFlatlistProps {
	data: any[];
	title: string;
	index: number;
	scrollToIndex: (index: number) => void;
	startLoader: () => void;
	expandedMeterId: string | null;
	setExpandedMeterId: (id: string | null) => void;
}

const AccordionFlatlist = ({
	data,
	title,
	startLoader,
	scrollToIndex,
	index,
	expandedMeterId,
	setExpandedMeterId,
}: AccordionFlatlistProps) => {
	const router = useRouter();
	const animations = useRef<any>({}).current;
	const rotateAnimations = useRef<any>({}).current;

	data?.forEach((item: any) => {
		const uniqueKey = `${title}-${item?.MeterId}`;
		if (!animations[uniqueKey]) {
			animations[uniqueKey] = new Animated.Value(0);
		}
		if (!rotateAnimations[uniqueKey]) {
			rotateAnimations[uniqueKey] = new Animated.Value(0); // 0 = down, 1 = up
		}
	});

	const toggleExpand = (id: number, detailsLength: number) => {
		const uniqueKey = `${title}-${id}`;
		const animation = animations[uniqueKey];
		const rotateAnim = rotateAnimations[uniqueKey];
		if (expandedMeterId === uniqueKey) {
			Animated.parallel([
				Animated.timing(animation, {
					toValue: 0,
					duration: 250,
					useNativeDriver: false,
				}),
				Animated.timing(rotateAnim, {
					toValue: 0, // collapse (rotate back down)
					duration: 250,
					useNativeDriver: Platform.OS === "android",
				}),
			]).start(() => setExpandedMeterId(null));
		} else {
			setExpandedMeterId(uniqueKey);

			const baseValue =
				detailsLength > 0
					? Platform.OS === "web"
						? detailsLength * 88
						: detailsLength * 78
					: Platform.OS === "web"
						? 30
						: 35;

			Animated.parallel([
				Animated.timing(animation, {
					toValue:
						Platform.select({
							ios: baseValue + 20,
							android: baseValue,
						}) ??
						(Platform.OS === "web" ? baseValue : baseValue + 40),
					duration: 250,
					useNativeDriver: false,
				}),
				Animated.timing(rotateAnim, {
					toValue: 1, // expand (rotate up)
					duration: 250,
					useNativeDriver: Platform.OS === "android",
				}),
			]).start();
		}
	};

	useEffect(() => {
		const collapseAnimations: Animated.CompositeAnimation[] = [];

		Object.keys(animations).forEach((key) => {
			if (key !== expandedMeterId && animations[key]) {
				collapseAnimations.push(
					Animated.timing(animations[key], {
						toValue: 0,
						duration: 250, // Faster
						useNativeDriver: false,
					})
				);
			}
			if (key !== expandedMeterId && rotateAnimations[key]) {
				collapseAnimations.push(
					Animated.timing(rotateAnimations[key], {
						toValue: 0, // reset icon rotation
						duration: 250,
						useNativeDriver: true,
					})
				);
			}
		});

		if (collapseAnimations.length > 0) {
			Animated.parallel(collapseAnimations).start();
		}
	}, [expandedMeterId]);

	const renderItem = ({ item }: any) => {
		const uniqueKey = `${title}-${item?.MeterId}`;
		const animation = animations[uniqueKey];
		const rotateAnim = rotateAnimations[uniqueKey];
		const rotate = rotateAnim.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "-180deg"],
		});
		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						toggleExpand(item?.MeterId, item?.ChannelList?.length);
						scrollToIndex(index);
					}}
					style={st.boxShadow}
					className="flex flex-row justify-between items-center p-4 mx-2 text-lg font-serif font-medium  my-1 bg-white space-x-1 h-20"
					activeOpacity={0.6}
				>
					<Text className="text-listText w-[95%] text-base font-normal">
						{item?.MeterName}
					</Text>
					<Animated.View style={{ transform: [{ rotate }] }}>
						<Fontisto name="caret-down" size={10} color="#484848" />
					</Animated.View>
				</TouchableOpacity>

				<Animated.View
					style={{
						height: animation,
						overflow: "hidden",
					}}
				>
					{item?.ChannelList?.length > 0 ? (
						item?.ChannelList.map((channels: any) => (
							<TouchableOpacity
								key={channels?.ChannelId}
								className="my-1 bg-accordionBg shadow-slate-200 shadow-lg p-3 pl-4 items-start justify-center  text-center border-y-4 border-y-white h-20"
								onPress={() => {
									startLoader();
									requestAnimationFrame(() => {
										router.push({
											pathname: ROUTEKEYS.LOADDATA_ID,
											params: {
												id: encodeURIComponent(
													JSON.stringify({
														ClientId:
															item?.ClientId,
														MeterId: item?.MeterId,
														EnergyType:
															item?.EnergyType,
														ChannelId:
															channels?.ChannelId,
														UnitId: channels?.UnitId,
														TimeFrame: "Week",
													})
												),
												title: channels?.ChanelName,
											},
										});
									});
								}}
							>
								<Text className="text-md font-normal text-listText">
									{channels?.ChanelName}
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
				</Animated.View>
			</View>
		);
	};

	return data?.length <= 0 ? (
		<ShimmerAccordion />
	) : (
		<>
			<Title title={title} />
			<FlatList
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				data={data}
				keyExtractor={(item) => item?.MeterId}
				renderItem={renderItem}
				contentContainerStyle={{ padding: 10 }}
			/>
		</>
	);
};

export default AccordionFlatlist;
