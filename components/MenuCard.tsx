import React, { memo } from "react";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { View, Text, Pressable, Platform } from "react-native";
import Portfolio from "@/components/SVG/Portfolio";
import Prices from "@/components/SVG/Prices";
import PFC from "@/components/SVG/PFC";
import Load from "@/components/SVG/Load";
import Settings from "@/components/SVG/Settings";
import { i18n } from "@/localization/localConfig";
import { router } from "expo-router";
import Signals from "./SVG/Signals";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";

interface MenuCardProps {
	item: {
		id: number;
		title: string;
		icon: string;
		notificationCount: number;
		route: any;
	};
	index: number;
}
const routeToComponent = (icon: string) => {
	switch (icon) {
		case "PRICES":
			return <Prices />;
		case "PFC":
			return <PFC />;
		case "LOAD":
			return <Load />;
		case "SIGNALS":
			return <Signals />;
		case "PORTFOLIO":
			return <Portfolio />;
		case "SETTINGS":
			return <Settings />;
		default:
			return <Text />;
	}
};
const NotificationIcon = ({ count }: { count: number }) => (
	<Svg
		height="40"
		width="40"
		style={{ position: "absolute", top: 14, right: 12, zIndex: 0 }}
	>
		<G>
			<Circle cx="20" cy="20" r="10" fill="#e31837" />
			<SvgText
				x="20"
				y="20"
				dy="3"
				fontSize="10"
				fontWeight="bold"
				fill="white"
				textAnchor="middle"
			>
				{count}
			</SvgText>
		</G>
	</Svg>
);

const MenuCard = memo(({ item }: MenuCardProps) => {
	const dispatch = useDispatch();

	return (
		<Pressable
			className=" m-1 items-center"
			onPressIn={async () => {
				dispatch(activeLoading());
				setTimeout(() => router.push(item.route));
			}}
		>
			<View
				className={`relative  bg-secondary  h-40   rounded-sm justify-center items-center ${
					Platform.OS === "web" ? "w-40 my-1" : "w-44 mx-2 my-5"
				}`}
			>
				{routeToComponent(item?.icon)}
				<Text className="text-xl text-fontColor font-medium uppercase mt-1">
					{i18n.t(item?.title)}
				</Text>
				{item?.notificationCount > 0 && (
					<NotificationIcon count={item?.notificationCount} />
				)}
			</View>
		</Pressable>
	);
});

export default MenuCard;
