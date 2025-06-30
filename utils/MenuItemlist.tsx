import { Platform } from "react-native";
import {
	MaterialIcons,
	FontAwesome,
	Ionicons,
	FontAwesome6,
} from "@expo/vector-icons";
import { ReactNode } from "react";
import { Href } from "expo-router";
import { ROUTEKEYS } from "./messages";

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
export const menuItems: MenuItem[] = [
	{
		label: "start",
		key: "",
		items: [],
		route: ROUTEKEYS.DASHBOARD,
		icon: <FontAwesome name="home" size={24} color="#9a9b9f" />,
	},
	{
		label: "marketinfo",
		key: "marketInfo",
		icon: <FontAwesome name="bar-chart-o" size={20} color="#9a9b9f" />,
		items: [
			{ label: "prices", route: ROUTEKEYS.PRICES },
			{ label: "pfc", route: ROUTEKEYS.PFC },
			{ label: "signals", route: ROUTEKEYS.SIGNALS },
		],
		height: Platform.OS === "web" ? 156 : 137,
	},
	{
		label: "consumption",
		key: "consumption",
		icon: <Ionicons name="speedometer-sharp" size={25} color="#9a9b9f" />,
		items: [{ label: "loaddata", route: ROUTEKEYS.LOADDATA }],
		height: Platform.OS === "web" ? 52 : 45,
	},
	{
		label: "portfolio",
		key: "",
		items: [],
		route: ROUTEKEYS.PORTFOLIO,
		icon: <Ionicons name="briefcase-sharp" size={23} color="#9a9b9f" />,
	},
	{
		label: "settings",
		route: ROUTEKEYS.SETTINGS,
		key: "",
		items: [],
		icon: (
			<MaterialIcons name="settings-suggest" size={25} color="#9a9b9f" />
		),
	},
	{
		label: "feedback",
		key: "feedback",
		icon: <MaterialIcons name="message" size={25} color="#9a9b9f" />,
		items: [
			{ label: "rateus", route: ROUTEKEYS.RATE },
			{ label: "contactus", route: ROUTEKEYS.CONTACT_US },
			{
				label: "visitwebsite",
				route: ROUTEKEYS.ENEXION_WEB_LINK,
			},
		],
		height: Platform.OS === "web" ? 156 : 136,
	},
	{
		label: "imprintLegalNotes",
		key: "legalNotes",
		icon: <FontAwesome6 name="scale-balanced" size={24} color="#9a9b9f" />,
		items: [
			{ label: "imprint", route: ROUTEKEYS.IMPRINT },
			{ label: "termsConditions", route: ROUTEKEYS.TERMS_CONDITIONS },
			{
				label: "privacypolicy",
				route: ROUTEKEYS.POLICY_PRIVACY,
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
		route: ROUTEKEYS.PRICES,
	},
	{
		id: 2,
		title: "pfc",
		icon: "PFC",
		notificationCount: 0,
		route: ROUTEKEYS.PFC,
	},
	{
		id: 3,
		title: "loaddata",
		icon: "LOAD",
		notificationCount: 0,
		route: ROUTEKEYS.LOADDATA,
	},
	{
		id: 4,
		title: "signals",
		icon: "SIGNALS",
		notificationCount: 3,
		route: ROUTEKEYS.SIGNALS,
	},
	{
		id: 5,
		title: "portfolio",
		icon: "PORTFOLIO",
		notificationCount: 0,
		route: ROUTEKEYS.PORTFOLIO,
	},
	{
		id: 6,
		title: "settings",
		icon: "SETTINGS",
		notificationCount: 0,
		route: ROUTEKEYS.SETTINGS,
	},
];
