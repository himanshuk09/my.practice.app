import Animated, {
	withSpring,
	useSharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { st } from "@/utils/Styles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { i18n } from "@/localization/config";
import React, { useEffect, useRef, useState } from "react";
import { tabsType, getTabsForScreen } from "@/types/chartComponent";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";

interface TabToggleButtonsProps {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<tabsType>>;
	screenName: string;
	isLoading: boolean;
}

const TabToggleButtons: React.FC<TabToggleButtonsProps> = React.memo(
	({ activeTab, setActiveTab, screenName, isLoading }) => {
		const globalLoader = useSelector(
			(state: RootState) => state?.navigation?.loading
		);

		const tabs = getTabsForScreen(screenName);
		const tabLayouts = useRef<{ x: number; width: number }[]>([]);
		const translateX = useSharedValue(0);
		const underlineWidth = useSharedValue(0);
		const [isMeasured, setIsMeasured] = useState(false);

		// Reset measurements when tabs change
		const onTabLayout = (index: number) => (event: LayoutChangeEvent) => {
			const { x, width } = event.nativeEvent.layout;
			tabLayouts.current[index] = { x, width };
			setIsMeasured(tabs.every((_, i) => tabLayouts.current[i]));
		};

		useEffect(() => {
			if (!isMeasured || activeTab === "" || globalLoader) return;

			const index = tabs.findIndex((tab) => tab === activeTab);
			const layout = tabLayouts.current[index];

			if (!layout) {
				setIsMeasured(false);
				return;
			}

			translateX.value = withSpring(layout.x, {
				damping: 25,
				stiffness: 200,
			});
			underlineWidth.value = withSpring(layout.width, {
				damping: 25,
				stiffness: 200,
			});
		}, [activeTab, isMeasured, globalLoader, tabs]);

		const animatedStyle = useAnimatedStyle(() => ({
			transform: [{ translateX: translateX.value }],
			width: underlineWidth.value > 10 ? underlineWidth.value : 10,
		}));

		return (
			<View className="relative w-full">
				<View className="flex-row justify-between w-full">
					{tabs.map((tab: tabsType, index: number) => (
						<TouchableOpacity
							key={tab}
							onLayout={onTabLayout(index)}
							onPress={() => setActiveTab(tab)}
							className={`py-3 text-center rounded-sm h-14 flex-1 ${
								activeTab === tab ? "bg-white" : "bg-gray-100"
							}`}
							style={st.tabShadow}
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
				{isMeasured && activeTab !== "" && !globalLoader && (
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

//without animation
// const TabToggleButtons1: React.FC<TabToggleButtonsProps> = React.memo(
// 	({ activeTab, setActiveTab, visibleTabs, isLoading }) => {
// 		const allTabs = ["Day", "Week", "Month", "Quarter", "Year"];
// 		const tabs = visibleTabs || allTabs;

// 		return (
// 			<View className="flex-row justify-between  w-full">
// 				{tabs.map((tab: any) => (
// 					<TouchableOpacity
// 						key={tab}
// 						onPress={() => {
// 							setActiveTab(tab);
// 						}}
// 						className={`flex-1 py-3 text-center rounded-sm h-14 ${
// 							activeTab === tab
// 								? "border-b-4 border-primary bg-white "
// 								: "bg-gray-100  "
// 						}`}
// 						disabled={isLoading}
// 						style={st.tabShadow}
// 					>
// 						<Text
// 							className={`text-lg text-center font-semibold ${
// 								activeTab === tab
// 									? "text-primary"
// 									: "text-[#898a8c]"
// 							}`}
// 						>
// 							{i18n.t(tab)}
// 						</Text>
// 					</TouchableOpacity>
// 				))}
// 			</View>
// 		);
// 	}
// );
export default TabToggleButtons;
