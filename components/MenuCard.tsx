import React, { memo } from "react";
import { router } from "expo-router";
import PFC from "@/components/SVG/PFC";
import Load from "@/components/SVG/Load";
import { useDispatch } from "react-redux";
import { i18n } from "@/localization/config";
import Prices from "@/components/SVG/Prices";
import Signals from "@/components/SVG/Signals";
import Settings from "@/components/SVG/Settings";
import Portfolio from "@/components/SVG/Portfolio";
import { activeLoading } from "@/store/navigationSlice";
import { View, Text, Pressable, Platform } from "react-native";
import NotificationIcon from "@/components/SVG/NotificationIcon";

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

const MenuCard = memo(({ item }: MenuCardProps) => {
	const dispatch = useDispatch();

	return (
		<Pressable
			className="m-1 items-center"
			onPressIn={() => {
				dispatch(activeLoading());
				setTimeout(() => router.push(item.route));
			}}
		>
			<View
				className={`relative  bg-secondary  h-40  justify-center items-center ${
					Platform.OS === "web"
						? "w-40 my-1"
						: "w-[11.5rem] mx-px my-5"
				}`}
			>
				{routeToComponent(item?.icon)}
				<Text className="text-xl text-fontColor font-medium uppercase mt-2">
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
