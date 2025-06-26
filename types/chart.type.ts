import WebView from "react-native-webview";

/**
 * Togglechart Props
 */
export type tabsType =
	| "Day"
	| "Week"
	| "Month"
	| "Quarter"
	| "Year"
	| "Year_3"
	| "";

export type ScreenName =
	| "prices"
	| "pfc"
	| "signals"
	| "loaddata"
	| "portfolio";

export type graphPriceUnit = [
	" €/MWh",
	" €/MWh",
	" €/MWh",
	" US$/ton",
	" €/ton",
	" TL/MWh",
];
export type currencySymbol = [" €", " €", " €", " US$", " €", " TL"];

export type timeFrameText = [
	"Day",
	"Week",
	"Month",
	"Quarter",
	"Year",
	"ThreeYear",
	"Custom",
];

export type TimeFrameString =
	| "day"
	| "Week"
	| "Month"
	| "Quarter"
	| "Year"
	| "ThreeYear"
	| "Custom";

export type TimeFrame = TimeFrameString | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getTabsForScreen = (screen: string): tabsType[] => {
	switch (screen) {
		case "pfc":
			return ["Week", "Month", "Quarter", "Year", "Year_3"];
		default:
			return ["Day", "Week", "Month", "Quarter", "Year"];
	}
};

/**
 * ChartComponent  Props
 */

export type ChartComponentProps = {
	webViewRef: React.RefObject<WebView | any>;
	iFrameRef: React.RefObject<HTMLIFrameElement | any>;
	webViewhtmlContent: string;
	iFramehtmlContent: string;
	onMessage?: (event: any) => void;
	activeTab?: string;
	showToolbar?: boolean;
	isChartEmpty?: boolean;
	setMaxMinValues?: React.Dispatch<
		React.SetStateAction<{
			minX: number | string;
			minY: number | string;
			maxX: number | string;
			maxY: number | string;
		}>
	>;
	isTooltipEnabled?: boolean;
	showToggleOrientation?: boolean;
	iFrameWidth?: string | number | undefined;
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	setIsChartLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
	setShowChartShimmer?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Toggle ChartComponent  Props
 */

export type ToggleChartComponentProps = {
	screenName?: ScreenName;
	fetchChartData?: any;
	yaxisunit?: string;
	setActiveTabForFileName?: React.Dispatch<React.SetStateAction<tabsType>>;
};
