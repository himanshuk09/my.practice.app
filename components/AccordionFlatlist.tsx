import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Animated,
	Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { st } from "@/utils/Styles";
import { ShimmerAccordion } from "./ShimmerEffect";

const AccordionFlatlist = ({
	data,
	title,
	startLoader,
	scrollToIndex,
	index,
}: any) => {
	const [expanded, setExpanded] = useState<number | null>(null);
	const animations = useRef<any>({}).current;
	const router = useRouter();
	data?.forEach((item: any) => {
		if (!animations[item?.MeterId]) {
			animations[item?.MeterId] = new Animated.Value(0);
		}
	});

	const toggleExpand = (id: number, detailsLength: number) => {
		const animation = animations[id];

		if (expanded === id) {
			Animated.timing(animation, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false,
			}).start(() => setExpanded(null));
		} else {
			// Collapse all open accordions
			Object.keys(animations).forEach((key) => {
				if (animations[key]) {
					Animated.timing(animations[key], {
						toValue: 0,
						duration: 200,
						useNativeDriver: false,
					}).start();
				}
			});
			const baseValue =
				detailsLength > 0
					? Platform.OS === "web"
						? detailsLength * 88
						: detailsLength * 78
					: Platform.OS === "web"
						? 30
						: 35;
			// Expand the clicked accordion
			Animated.timing(animation, {
				toValue:
					Platform.select({
						ios: baseValue + 20,
						android: baseValue,
					}) ??
					(Platform.OS === "web" ? baseValue : baseValue + 40),
				duration: 100,
				useNativeDriver: false,
			}).start(() => setExpanded(id));
		}
	};
	const renderItem = ({ item }: any) => {
		const isExpanded = expanded === item?.MeterId;

		const animation = animations[item?.MeterId];

		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						toggleExpand(
							item?.MeterId,
							item?.ChannelList?.length
						);
						scrollToIndex(index);
					}}
					style={st.boxShadow}
					className="flex flex-row justify-between items-center p-4 mx-2 text-lg font-serif font-medium rounded-sm my-1   bg-white space-x-1 h-20 "
					activeOpacity={0.6}
				>
					<Text className="text-listText w-[95%] text-base  font-normal">
						{item?.MeterName}
					</Text>
					<AntDesign
						name={isExpanded ? "caretup" : "caretdown"}
						size={10}
						color="#484848"
					/>
				</TouchableOpacity>

				<Animated.View
					style={{
						height: animation,
						overflow: "hidden",
					}}
				>
					{item?.ChannelList?.length > 0 ? (
						item?.ChannelList.map(
							(channels: any, index: number) => (
								<TouchableOpacity
									key={channels?.ChannelId}
									className="my-1 bg-accordionBg shadow-slate-200 shadow-lg p-3 pl-4 items-start justify-center  rounded-sm text-center border-y-4 border-y-white h-20"
									onPress={() => {
										startLoader();

										setTimeout(() =>
											router.push({
												pathname: `/dashboard/(tabs)/loaddata/[id]`,
												params: {
													id: encodeURIComponent(
														JSON.stringify(
															1
														)
													),
												},
											})
										);
									}}
								>
									<Text className="text-md font-normal text-listText">
										{channels?.ChanelName}
									</Text>
								</TouchableOpacity>
							)
						)
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
			<View className="w-full  p-3 bg-primary">
				<Text className="flex justify-start font-normal  py-2 p-3  items-center mb-4  h-14 text-xl rounded-sm text-white">
					{title}
				</Text>
			</View>
			<FlatList
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				data={data}
				keyExtractor={(item) => item?.MeterId}
				renderItem={renderItem}
				contentContainerStyle={{
					padding: 10,
				}}
			/>
		</>
	);
};

export default AccordionFlatlist;
