import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	StyleSheet,
	Platform,
	LayoutChangeEvent,
} from "react-native";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { i18n } from "@/localization/config";
import { getTabsForScreen, tabsType } from "@/types/chart.type";
import { MaterialIcons } from "@expo/vector-icons";

interface FloatingActionMenuProps {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<tabsType>>;
	screenName: string;
	isLoading: boolean;
}

const FloatingActionMenu = ({
	activeTab,
	setActiveTab,
	screenName,
	isLoading,
}: FloatingActionMenuProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [animation] = useState(new Animated.Value(0));
	const [isMeasured, setIsMeasured] = useState(false);

	const globalLoader = useSelector(
		(state: RootState) => state?.navigation?.loading
	);
	const tabLayouts = useRef<{ x: number; width: number }[]>([]);
	const translateX = useRef(new Animated.Value(0)).current;
	const underlineWidth = useRef(new Animated.Value(0)).current;

	const toggleMenu = () => {
		const toValue = isMenuOpen ? 0 : 1;

		Animated.timing(animation, {
			toValue,
			duration: 100,
			useNativeDriver: false,
		}).start();

		setIsMenuOpen(!isMenuOpen);
	};

	const menuOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});

	const menuTranslateX = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 0],
	});

	const tabs = getTabsForScreen(screenName);

	const onTabLayout = (index: number) => (event: LayoutChangeEvent) => {
		const { x, width } = event.nativeEvent.layout;
		tabLayouts.current[index] = { x, width };
		if (tabLayouts.current.filter(Boolean).length === tabs.length) {
			setIsMeasured(true);
		}
	};

	useEffect(() => {
		if (!isMeasured && activeTab !== "" && !globalLoader) return;
		const index = tabs.findIndex((tab: string) => tab === activeTab);
		const layout = tabLayouts.current[index];
		if (layout) {
			Animated.timing(translateX, {
				toValue: layout.x,
				duration: 200,
				useNativeDriver: false,
			}).start();
			Animated.timing(underlineWidth, {
				toValue: layout.width - 4,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
	}, [activeTab, isMeasured, globalLoader]);

	const formatTabLabel = (tab: string) => {
		if (tab === "Year_3") return "Y3";
		return tab.charAt(0);
	};

	return (
		<View className="absolute top-0 left-6 pt-1 pl-1 z-[1000]">
			<TouchableOpacity
				className="bg-[#e11935] w-[30px] h-[30px] rounded-full justify-center items-center "
				onPress={toggleMenu}
			>
				<MaterialIcons
					name={isMenuOpen ? "filter-alt-off" : "filter-alt"}
					size={15}
					color="white"
				/>
			</TouchableOpacity>

			{isMenuOpen && (
				<Animated.View
					style={{
						opacity: menuOpacity,
						transform: [{ translateX: menuTranslateX }],
					}}
					className="absolute top-1 left-[50px] flex-row items-center"
				>
					<View className="relative flex-row">
						{isMeasured && activeTab !== "" && (
							<Animated.View
								style={{
									transform: [{ translateX }],
									width: underlineWidth,
								}}
								className="absolute bottom-0 h-[30px] rounded-full border-2 border-[#e11935] z-[100]"
							/>
						)}

						{tabs.map((tab: tabsType, index: number) => (
							<View
								key={index}
								onLayout={onTabLayout(index)}
								className="flex-row items-center mx-[1px]"
							>
								<TouchableOpacity
									className={`w-[30px] h-[30px] rounded-full justify-center items-center mr-1 ${
										activeTab === tab
											? "bg-white"
											: "bg-gray-100"
									}`}
									onPress={() => setActiveTab(tab)}
									disabled={isLoading}
								>
									<Text
										className={`uppercase text-[16px] ${
											activeTab === tab
												? "text-[#e11935] font-semibold"
												: "text-black"
										}`}
									>
										{i18n.t(formatTabLabel(tab))}
									</Text>
								</TouchableOpacity>
							</View>
						))}
					</View>
				</Animated.View>
			)}
		</View>
	);
};

export default FloatingActionMenu;

//Without Animation
const FloatingActionMenu1 = ({
	activeTab,
	setActiveTab,
	visibleTabs,
	isLoading,
}: any) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [animation] = useState(new Animated.Value(0));
	const toggleMenu = () => {
		const toValue = isMenuOpen ? 0 : 1;

		Animated.timing(animation, {
			toValue,
			duration: 100,
			useNativeDriver: Platform.OS === "android",
		}).start();

		setIsMenuOpen(!isMenuOpen);
	};

	const menuOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});

	const menuTranslateX = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 0], // Slide menu items into view
	});

	const allTabs = ["Day", "Week", "Month", "Quarter", "Year"];
	const tabs = visibleTabs || allTabs;
	const formatTabLabel = (tab: string) => {
		if (tab === "Year_3") return "Y3";
		return tab.charAt(0); // Take the first letter of the tab
	};

	return (
		<View style={styles.container}>
			{/* Floating Action Button */}
			<TouchableOpacity style={styles.fab} onPress={toggleMenu}>
				<MaterialIcons
					name={isMenuOpen ? "filter-alt-off" : "filter-alt"}
					size={15}
					color="white"
				/>
			</TouchableOpacity>

			{/* Menu Items */}
			{isMenuOpen && (
				<Animated.View
					style={[
						styles.menuItemsContainer,
						{
							opacity: menuOpacity,
							transform: [{ translateX: menuTranslateX }],
						},
					]}
				>
					{tabs.map((tab: any, index: any) => (
						<View style={styles.menuItem} key={index}>
							<TouchableOpacity
								style={[
									styles.menuIcon,
									activeTab === tab
										? styles.activeMenuItem
										: styles.inactiveMenuItem,
								]}
								onPress={() => {
									setActiveTab(tab);
								}}
								disabled={isLoading}
							>
								<Text
									style={[
										styles.menuText,
										activeTab === tab
											? styles.activeMenuText
											: styles.inactiveMenuText,
									]}
									className="uppercase"
								>
									{/* {i18n.t(tab.name)} */}
									{i18n.t(formatTabLabel(tab))}
								</Text>
							</TouchableOpacity>
						</View>
					))}
				</Animated.View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	activeMenuText: {
		color: "#e11935",
		fontWeight: "600",
	},
	inactiveMenuText: {
		color: "black",
	},
	container: {
		position: "absolute",
		top: 0,
		left: 25,
		paddingTop: 3,
		paddingLeft: 5,
		zIndex: 1000,
	},
	fab: {
		backgroundColor: "#e11935",
		width: 30,
		height: 30,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		...Platform.select({
			android: {
				elevation: 5,
			},
		}),
	},
	menuItemsContainer: {
		position: "absolute",
		top: 5,
		left: 50,
		flexDirection: "row",
		alignItems: "center",
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 1,
	},
	menuIcon: {
		backgroundColor: "#e11935",
		width: 30,
		height: 30,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 5,
	},
	menuText: {
		color: "white",
		fontSize: 16,
		margin: 1,
	},
	activeMenuItem: {
		backgroundColor: "white",
		borderWidth: 2,
		borderColor: "#e11935",
		fontWeight: "bold",
	},
	inactiveMenuItem: {
		backgroundColor: "#f3f4f6",
	},
});
