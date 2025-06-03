import { st } from "@/utils/Styles";
import { i18n } from "@/localization/config";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

interface TabToggleButtonsProps {
	activeTab: string;
	setActiveTab: any;
	visibleTabs: any;
	setLoading?: any;
	timeoutRef?: any;
	isLoading?: boolean;
}

const TabToggleButtons: React.FC<TabToggleButtonsProps> = React.memo(
	({ activeTab, setActiveTab, visibleTabs, isLoading }) => {
		const allTabs = ["Day", "Week", "Month", "Quarter", "Year"];
		const tabs = visibleTabs || allTabs;

		const tabLayouts = useRef<{ x: number; width: number }[]>([]);
		const translateX = useSharedValue(0);
		const underlineWidth = useSharedValue(0);

		const [isMeasured, setIsMeasured] = useState(false);

		const onTabLayout = (index: number) => (event: LayoutChangeEvent) => {
			const { x, width } = event.nativeEvent.layout;
			tabLayouts.current[index] = { x, width };

			if (tabLayouts.current.filter(Boolean).length === tabs.length) {
				setIsMeasured(true);
			}
		};

		useEffect(() => {
			if (!isMeasured) return;

			const index = tabs.findIndex((tab: string) => tab === activeTab);
			const layout = tabLayouts.current[index];
			if (layout) {
				translateX.value = withTiming(layout.x, { duration: 200 });
				underlineWidth.value = withTiming(layout.width, {
					duration: 200,
				});
			}
		}, [activeTab, isMeasured]);

		const animatedStyle = useAnimatedStyle(() => ({
			transform: [{ translateX: translateX.value }],
			width: underlineWidth.value,
		}));

		return (
			<View className="relative w-full">
				<View className="flex-row justify-between w-full">
					{tabs.map((tab: string, index: number) => (
						<TouchableOpacity
							key={tab}
							onLayout={onTabLayout(index)}
							onPress={() => setActiveTab(tab)}
							className={`py-3 text-center rounded-sm h-14 flex-1 ${
								activeTab === tab ? "bg-white" : "bg-gray-100"
							}`}
							disabled={isLoading}
						>
							<Text
								className={`text-lg text-center font-semibold ${
									activeTab === tab
										? "text-primary"
										: "text-[#898a8c]"
								}`}
							>
								{i18n.t(tab)}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				{isMeasured && (
					<Animated.View
						style={[
							{
								position: "absolute",
								bottom: 0,
								left: 0,
								height: 4,
								backgroundColor: "#e31837", // Replace with theme color
								borderRadius: 8,
							},
							animatedStyle,
						]}
					/>
				)}
			</View>
		);
	}
);

export default TabToggleButtons;

//without animation
const TabToggleButtons1: React.FC<TabToggleButtonsProps> = React.memo(
	({ activeTab, setActiveTab, visibleTabs, isLoading }) => {
		const allTabs = ["Day", "Week", "Month", "Quarter", "Year"];
		const tabs = visibleTabs || allTabs;

		return (
			<View className="flex-row justify-between  w-full">
				{tabs.map((tab: any) => (
					<TouchableOpacity
						key={tab}
						onPress={() => {
							setActiveTab(tab);
						}}
						className={`flex-1 py-3 text-center rounded-sm h-14 ${
							activeTab === tab
								? "border-b-4 border-primary bg-white "
								: "bg-gray-100  "
						}`}
						disabled={isLoading}
						style={st.tabShadow}
					>
						<Text
							className={`text-lg text-center font-semibold ${
								activeTab === tab
									? "text-primary"
									: "text-[#898a8c]"
							}`}
						>
							{i18n.t(tab)}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	}
);
