import WebView from "react-native-webview";
import { DateType } from "react-native-ui-datepicker";
/**
 * ChartComponentProps
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

export type ToggleChartComponentProps = {
	screenName?: ScreenName;
	fetchChartData?: any;
	yaxisunit?: string;
	setActiveTabForFileName?: React.Dispatch<React.SetStateAction<tabsType>>;
};

export const getTabsForScreen = (screen: string): tabsType[] => {
	switch (screen) {
		case "pfc":
			return ["Week", "Month", "Quarter", "Year", "Year_3"];
		default:
			return ["Day", "Week", "Month", "Quarter", "Year"];
	}
};

///
export type initialViewProps = "day" | "month" | "year" | "time";
export type DateTimeRange = {
	startDate?: DateType | string;
	endDate?: DateType | string;
};
export interface PickerModelProps {
	screenName?: ScreenName;
	maxMinValues?: any;
	setMaxMinValues?: any;
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	handleRangeDataFilter?: any;
	range?: DateTimeRange;
	setRange: (range: DateTimeRange | any) => void;
}
