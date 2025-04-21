import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Text,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { i18n } from "@/localization/config";

export default function FloatingActionMenu({
	activeTab,
	setActiveTab,
	visibleTabs,
	isLoading,
}: any) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [animation] = useState(new Animated.Value(0));
	const toggleMenu = () => {
		const toValue = isMenuOpen ? 0 : 1;

		Animated.timing(animation, {
			toValue,
			duration: 100,
			useNativeDriver: Platform.OS !== "web" ? true : false,
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
}

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
