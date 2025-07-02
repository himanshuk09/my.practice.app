import React, { memo } from "react";
import PFC from "@/components/svg/PFC";
import Load from "@/components/svg/Load";
import { useDispatch } from "react-redux";
import { Href, router } from "expo-router";
import { i18n } from "@/localization/config";
import Prices from "@/components/svg/Prices";
import Signals from "@/components/svg/Signals";
import Settings from "@/components/svg/Settings";
import Portfolio from "@/components/svg/Portfolio";
import { activeLoading } from "@/store/navigationSlice";
import { View, Text, Pressable, Platform } from "react-native";
import NotificationIcon from "@/components/svg/NotificationIcon";

interface MenuCardProps {
	item: {
		id: number;
		title: string;
		icon: string;
		notificationCount: number;
		route: string | Href;
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
				requestAnimationFrame(() => {
					router.push(item.route as Href);
				});
				dispatch(activeLoading());
			}}
		>
			<View
				className={`relative bg-secondary justify-center items-center ${
					Platform.OS === "web"
						? "w-[11.7rem] my-1"
						: "w-[11.7rem] mx-px my-5"
				} h-[11rem]`}
			>
				{/* Icon Wrapper with fixed height to normalize SVG alignment */}
				<View className="h-16 justify-center items-center">
					{routeToComponent(item?.icon)}
				</View>

				{/* Title below icon */}
				<Text className="text-xl text-fontColor font-medium uppercase mt-2 text-center">
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
