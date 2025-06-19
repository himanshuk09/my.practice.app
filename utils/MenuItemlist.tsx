import { Platform } from "react-native";
import {
	MaterialIcons,
	FontAwesome,
	Ionicons,
	FontAwesome6,
} from "@expo/vector-icons";
import { ReactNode } from "react";
import { Href } from "expo-router";

interface MenuSubItem {
	label: string;
	route: string;
}

export interface MenuItem {
	label: string;
	key: string;
	route?: Href;
	items?: MenuSubItem[];
	icon: ReactNode;
	height?: number;
}
const menuItems: MenuItem[] = [
	{
		label: "start",
		key: "",
		items: [],
		route: "/dashboard",
		icon: <FontAwesome name="home" size={23} />,
	},
	{
		label: "marketinfo",
		key: "marketInfo",
		icon: <FontAwesome name="bar-chart-o" size={20} color="#9a9b9f" />,
		items: [
			{ label: "prices", route: "dashboard/(tabs)/prices" },
			{ label: "pfc", route: "dashboard/(tabs)/pfc" },
			{ label: "signals", route: "dashboard/(tabs)/signals" },
		],
		height: Platform.OS === "web" ? 156 : 137,
	},
	{
		label: "consumption",
		key: "consumption",
		icon: <Ionicons name="speedometer-sharp" size={24} color="#9a9b9f" />,
		items: [{ label: "loaddata", route: "dashboard/(tabs)/loaddata" }],
		height: Platform.OS === "web" ? 52 : 45,
	},
	{
		label: "portfolio",
		key: "",
		items: [],
		route: "/dashboard/(tabs)/portfolio",
		icon: <Ionicons name="briefcase-sharp" size={20} color="#9a9b9f" />,
	},
	{
		label: "settings",
		route: "/dashboard/settings",
		key: "",
		items: [],
		icon: (
			<MaterialIcons name="settings-suggest" size={25} color="#9a9b9f" />
		),
	},
	{
		label: "feedback",
		key: "feedback",
		icon: <MaterialIcons name="message" size={24} color="#9a9b9f" />,
		items: [
			{ label: "rateus", route: "dashboard/feedback/rate" },
			{ label: "contactus", route: "dashboard/feedback/contact" },
			{
				label: "visitwebsite",
				route: "http://test-eec.enexion-sys.de/Cockpit.aspx",
			},
		],
		height: Platform.OS === "web" ? 156 : 136,
	},
	{
		label: "imprintLegalNotes",
		key: "legalNotes",
		icon: <FontAwesome6 name="scale-balanced" size={24} color="#9a9b9f" />,
		items: [
			{ label: "imprint", route: "dashboard/legalnotes/imprint" },
			{ label: "termsConditions", route: "dashboard/legalnotes/tc" },
			{
				label: "privacypolicy",
				route: "dashboard/legalnotes/privacypolicy",
			},
		],
		height: Platform.OS === "web" ? 160 : 138,
	},
];
export const dashboardMenuItems = [
	{
		id: 1,
		title: "prices",
		icon: "PRICES",
		notificationCount: 0,
		route: "dashboard/(tabs)/prices",
	},
	{
		id: 2,
		title: "pfc",
		icon: "PFC",
		notificationCount: 0,
		route: "dashboard/(tabs)/pfc",
	},
	{
		id: 3,
		title: "loaddata",
		icon: "LOAD",
		notificationCount: 0,
		route: "dashboard/(tabs)/loaddata",
	},
	{
		id: 4,
		title: "signals",
		icon: "SIGNALS",
		notificationCount: 3,
		route: "dashboard/(tabs)/signals",
	},
	{
		id: 5,
		title: "portfolio",
		icon: "PORTFOLIO",
		notificationCount: 0,
		route: "dashboard/(tabs)/portfolio",
	},
	{
		id: 6,
		title: "settings",
		icon: "SETTINGS",
		notificationCount: 0,
		route: "dashboard/settings",
	},
];
export { menuItems };
