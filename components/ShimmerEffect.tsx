import {
	View,
	Animated,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	FlatList,
} from "react-native";
import { st } from "@/utils/Styles";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { activeLoading } from "@/store/navigationSlice";

const ShimmerPrices = () => {
	const shimmerValue = useRef(new Animated.Value(-1)).current;
	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		const startShimmer = () => {
			Animated.loop(
				Animated.timing(shimmerValue, {
					toValue: 2,
					duration: 1500,
					useNativeDriver: Platform.OS === "android",
				})
			).start();
		};
		startShimmer();
	}, [shimmerValue]);

	const translateX = shimmerValue.interpolate({
		inputRange: [-1, 2],
		outputRange: [-screenWidth, screenWidth],
	});

	return (
		<TouchableOpacity
			className="flex flex-row justify-between items-center w-auto p-3 px-1 pl-4 font-medium my-1 bg-white h-20 mx-2"
			style={[st.boxShadow, styles.shimmerContainer]}
		>
			<View className="flex flex-row items-center justify-start">
				<View style={styles.shimmerBox} />
			</View>

			<View className="flex flex-row items-center justify-start">
				<View style={styles.shimmerBox} />
			</View>

			<View style={styles.iconPlaceholder} />

			<Animated.View
				style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
			/>
		</TouchableOpacity>
	);
};
const ShimmerPricesHeader = () => {
	const shimmerValue = useRef(new Animated.Value(-1)).current;
	const screenWidth = Dimensions.get("window").width;
	const dispatch = useDispatch();
	const router = useRouter();
	useEffect(() => {
		const startShimmer = () => {
			Animated.loop(
				Animated.timing(shimmerValue, {
					toValue: 2,
					duration: 1500,
					useNativeDriver: Platform.OS === "android",
				})
			).start();
		};
		startShimmer();
	}, [shimmerValue]);

	const translateX = shimmerValue.interpolate({
		inputRange: [-1, 2],
		outputRange: [-screenWidth, screenWidth],
	});

	return (
		<TouchableOpacity
			className="flex flex-row justify-between items-center  p-6  font-medium  bg-primary   w-[100%]"
			style={[st.boxShadow, styles.shimmerContainer]}
		>
			<View className="flex flex-col justify-start">
				<View className="flex flex-row items-center justify-start">
					<View style={styles.shimmerBox} />
				</View>

				<View className="flex flex-row items-center justify-start">
					<View style={styles.shimmerBox} />
				</View>
			</View>
			<Animated.View
				style={[
					styles.headerShimmerOverlay,
					{ transform: [{ translateX }] },
				]}
			/>
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
		</TouchableOpacity>
	);
};
const ShimmerHeader = () => {
	const shimmerValue = useRef(new Animated.Value(-1)).current;
	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		const startShimmer = () => {
			Animated.loop(
				Animated.timing(shimmerValue, {
					toValue: 2,
					duration: 1500,
					useNativeDriver: Platform.OS === "android",
				})
			).start();
		};
		startShimmer();
	}, [shimmerValue]);

	const translateX = shimmerValue.interpolate({
		inputRange: [-1, 2],
		outputRange: [-screenWidth, screenWidth],
	});

	return (
		<View
			className="flex flex-row justify-between items-center p-6 font-medium bg-primary w-[100%]"
			style={[st.boxShadow, styles.shimmerContainer]}
		>
			<View className="flex flex-col justify-start my-2">
				<View className="flex flex-row items-center justify-start">
					<View style={styles.shimmerBox} />
				</View>
			</View>
			<Animated.View
				style={[
					styles.headerShimmerOverlay,
					{ transform: [{ translateX }] },
				]}
			/>
		</View>
	);
};
const ShimmerAccordionListCard = () => {
	const shimmerValue = useRef(new Animated.Value(-1)).current;
	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		const startShimmer = () => {
			Animated.loop(
				Animated.timing(shimmerValue, {
					toValue: 2,
					duration: 1500,
					useNativeDriver: Platform.OS === "android",
				})
			).start();
		};
		startShimmer();
	}, [shimmerValue]);

	const translateX = shimmerValue.interpolate({
		inputRange: [-1, 2],
		outputRange: [-screenWidth, screenWidth],
	});

	return (
		<TouchableOpacity
			className="flex flex-row justify-between items-center w-auto p-3 px-1 pl-4 font-medium my-1 bg-white h-20 mx-2"
			style={[st.boxShadow, styles.shimmerContainer]}
		>
			<View className="flex flex-row items-center justify-start w-60 ">
				<View
					style={[styles.shimmerBox, { width: 150 }]}
					className="px-4"
				/>
			</View>
			<View style={styles.iconPlaceholder} />
			<Animated.View
				style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
			/>
		</TouchableOpacity>
	);
};
const ShimmerAccordion = () => {
	return (
		<View>
			<ShimmerHeader />
			<FlatList
				data={[...Array(4).keys()].map((index) => ({
					id: index,
					title: `Shimmer ${index}`,
					unit: 0,
					indicator: "Loading",
					route: "",
				}))}
				renderItem={(items) => <ShimmerAccordionListCard />}
				keyExtractor={(items, index) => index.toString()}
				initialNumToRender={20}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};
const ShimmerListCard = () => {
	const shimmerValue = useRef(new Animated.Value(-1)).current;
	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		const startShimmer = () => {
			Animated.loop(
				Animated.timing(shimmerValue, {
					toValue: 2,
					duration: 1500,
					useNativeDriver: Platform.OS === "android",
				})
			).start();
		};
		startShimmer();
	}, [shimmerValue]);

	const translateX = shimmerValue.interpolate({
		inputRange: [-1, 2],
		outputRange: [-screenWidth, screenWidth],
	});

	return (
		<TouchableOpacity
			className="flex flex-row justify-between items-center w-auto p-3 px-1 pl-4 font-medium my-1 bg-white h-20 mx-2"
			style={[st.boxShadow, styles.shimmerContainer]}
		>
			<View className="flex flex-row items-center justify-start w-44 m-1">
				<View style={styles.shimmerBox} />
			</View>

			<Animated.View
				style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
			/>
		</TouchableOpacity>
	);
};
const ShimmerFlatListBlock = ({ height }: { height: number | string }) => {
	return (
		<View
			style={{
				height: height,
			}}
		>
			<ShimmerHeader />
			<FlatList
				data={[...Array(10).keys()].map((index) => ({
					id: index,
					title: `Shimmer ${index}`,
					unit: 0,
					indicator: "Loading",
					route: "",
				}))}
				renderItem={(items) => <ShimmerListCard />}
				keyExtractor={(items, index) => index.toString()}
				initialNumToRender={50}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};
const ShimmerScreenHeader = () => {
	const shimmerValue = useRef(new Animated.Value(-1)).current;
	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		const startShimmer = () => {
			Animated.loop(
				Animated.timing(shimmerValue, {
					toValue: 2,
					duration: 1500,
					useNativeDriver: Platform.OS === "android",
				})
			).start();
		};
		startShimmer();
	}, [shimmerValue]);

	const translateX = shimmerValue.interpolate({
		inputRange: [-1, 2],
		outputRange: [-screenWidth, screenWidth],
	});

	return (
		<View
			className="flex flex-row justify-between items-center p-6 font-medium bg-white w-[100%]"
			style={[st.boxShadow, styles.shimmerContainer]}
		>
			<View className="flex flex-col justify-start my-2">
				<View className="flex flex-row items-center justify-start">
					<View style={styles.shimmerBox} />
				</View>
				<View className="flex flex-row items-center justify-start">
					<View style={styles.shimmerBox} />
				</View>
			</View>
			<View style={styles.iconPlaceholder} />
			<Animated.View
				style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	shimmerContainer: {
		overflow: "hidden",
		position: "relative",
	},
	shimmerBox: {
		height: 10,
		width: 100,
		backgroundColor: "#f0f0f0",
		borderRadius: 5,
		marginBottom: 10,
	},
	iconPlaceholder: {
		height: 26,
		width: 26,
		backgroundColor: "#f0f0f0",
		borderRadius: 12,
		marginRight: 10,
	},
	shimmerOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.6)",
		opacity: 0.5,
	},
	headerShimmerOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "150%",
		backgroundColor: "rgba(227, 24, 54, 0.6)",
		opacity: 0.5,
	},
	shimmerGradient: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.3)", // Light effect
		position: "absolute",
	},
});

export {
	ShimmerPrices,
	ShimmerListCard,
	ShimmerHeader,
	ShimmerPricesHeader,
	ShimmerFlatListBlock,
	ShimmerAccordionListCard,
	ShimmerAccordion,
	ShimmerScreenHeader,
};
