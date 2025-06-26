import { Text } from "react-native";
import WebView from "react-native-webview";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";

type FloatingActionMenuProps = {
	webViewRef: React.RefObject<WebView | any>;
	showToggle?: boolean;
	captureWebView?: any;
	isTooltipEnabled?: boolean;
};

export default function FloatingActionMenu({
	webViewRef,
	captureWebView,
	isTooltipEnabled,
}: FloatingActionMenuProps) {
	//
	const [isZoomIn, setIsZoomIn] = useState(true);
	const [tooltip, setTooltip] = useState<boolean | any>(false);
	const [tooltipLabel, setTooltipLabel] = useState<any>(null);
	const intervalRef = useRef<NodeJS.Timeout | number>(null);
	const debouncedExport = useDebounce((item: any) => item(), 1000);
	const menuItems = [
		{
			icon: isZoomIn ? "search-plus" : "search-minus",
			action: "toggleZoomAndSelection()",
			size: 15,
			color: "#e31837",
			label: "Zoom",
		},
		{
			icon: "plus-circle",
			action: "zoomIn()",
			size: 15,
			color: "#848484",
			label: "Zoom In",
		},
		{
			icon: "minus-circle",
			action: "zoomOut()",
			size: 15,
			color: "#848484",
			label: "Zoom Out",
		},

		{
			icon: "hand-point-left",
			action: "customPanLeft()",
			size: 15,
			color: "#848484",
			label: "Pan Left",
		},
		{
			icon: "hand-point-right",
			action: "customPanRight()",
			size: 15,
			color: "#848484",
			label: "Pan Right",
		},
		{
			icon: "home",
			action: "resetZoom()",
			size: 15,
			color: "#848484",
			label: "Reset Zoom",
		},
		{
			icon: "git-commit",
			action: `toggleMarkers()`,
			size: 22,
			color: tooltip ? "#e31837" : "#848484",
			label: "Marker",
		},
		{
			icon: "download",
			// action: `exportChart()`,
			action: () => captureWebView(),
			size: 15,
			color: "#848484",
			label: "Download",
		},
	];
	useEffect(() => {
		setTooltip(isTooltipEnabled);
	}, [isTooltipEnabled]);
	return (
		<View style={styles.container}>
			<View style={[styles.menuItemsContainer, { right: 5 }]}>
				{menuItems.map((item: any, index) => (
					<View style={styles.menuItem} key={index}>
						<TouchableOpacity
							style={styles.menuIcon}
							onPress={() => {
								if (item.label === "Download") {
									debouncedExport(item?.action);
								} else {
									(
										webViewRef?.current as any
									)?.injectJavaScript(item.action);
								}

								if (item.action === `toggleMarkers()`) {
									setTooltip(!tooltip);
								}
								if (
									item.action === `toggleZoomAndSelection()`
								) {
									setIsZoomIn(!isZoomIn);
								}
								setTooltipLabel(null);
							}}
							onLongPress={() => {
								setTooltipLabel(item?.label);

								// Repeatedly call the JS every 500ms (you can adjust)
								intervalRef.current = setInterval(() => {
									if (item.label !== "Download") {
										(
											webViewRef?.current as any
										)?.injectJavaScript(item.action);
									}
								}, 100);
							}}
							onPressOut={() => {
								// Stop calling JS when user lifts finger
								if (intervalRef.current) {
									clearInterval(intervalRef.current);
									intervalRef.current = null;
								}
							}}
						>
							{item.label !== "Marker" ? (
								<FontAwesome5
									name={item.icon}
									size={item.size}
									color={item.color}
								/>
							) : (
								<Octicons
									name={item.icon}
									size={item.size}
									color={item.color}
									style={{
										transform: [{ rotate: "-25deg" }],
										marginTop: 2,
									}}
								/>
							)}
							{tooltipLabel === item.label && (
								<Text style={styles.tooltipText}>
									{item.label}
								</Text>
							)}
						</TouchableOpacity>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 0,
		right: 10,
		paddingTop: 3,
		paddingRight: 5,
		zIndex: 49,
	},
	fab: {
		backgroundColor: "#e31837",
		width: 30,
		height: 30,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		...Platform.select({
			android: {
				elevation: 2,
			},
		}),
	},
	menuItemsContainer: {
		position: "absolute",
		top: 3,
		flexDirection: "row",
		alignItems: "center",
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 1,
	},
	menuIcon: {
		width: 30,
		height: 30,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 1,
	},
	activeMenuItem: {
		backgroundColor: "#848484",
		borderWidth: 2,
		borderColor: "#f3f4f6",
		fontWeight: "bold",
	},
	inactiveMenuItem: {
		backgroundColor: "#f3f4f6",
	},
	tooltipText: {
		marginTop: 5,
		fontSize: 12,
		color: "#848484",
		textAlign: "center",
		top: 13,
		position: "absolute",
		width: 50,
	},
});
