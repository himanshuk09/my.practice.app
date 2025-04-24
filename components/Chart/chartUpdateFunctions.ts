import { i18n } from "@/localization/config";
import { Platform } from "react-native";
type ChartUpdateType = "series" | "options" | "chart";

export const updateApexChart = (
	type: ChartUpdateType,
	webViewRef: any,
	iframeRef: any,
	data?: any,
	options?: any
) => {
	if (Platform.OS === "web") {
		const iframe = iframeRef.current;
		if (iframe && iframe?.contentWindow) {
			switch (type) {
				case "series":
					iframe.contentWindow.updateChartSeries?.(data);

					break;
				case "options":
					iframe.contentWindow.updateChartOptions?.(data);
					break;
				case "chart":
					iframe.contentWindow.updateChart?.(data, options);

					break;
				default:
					console.error("Invalid chart update type");
					return;
			}
		} else {
			console.error("Iframe contentWindow is not accessible.");
		}
	} else {
		let jsCommand = "";
		switch (type) {
			case "series":
				jsCommand = `updateChartSeries(${JSON.stringify(data)});`;
				break;
			case "options":
				jsCommand = `updateChartOptions(${JSON.stringify(data)});`;
				break;
			case "chart":
				jsCommand = `updateChart(${JSON.stringify(
					data
				)}, ${JSON.stringify(options || {})});`;
				break;
			default:
				console.error("Invalid chart update type");
				return;
		}

		(webViewRef.current as any)?.injectJavaScript(jsCommand);
	}
};

export const updateEmptyChart = (
	webViewRef?: any,
	iframeRef?: any,
	chartType?: any
) => {
	let options = {
		chart: {
			series: [],
		},
		noData: {
			text: chartType == "donut" ? "NA" : i18n.t("Data_not_available"),
		},
		grid: {
			show: true,
		},
		xaxis: {
			show: false,
			tickAmount: 0,
			labels: {
				show: false,
			},
			title: {
				text: "",
				style: {
					fontSize: "0",
				},
			},
			axisTicks: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
		},
		yaxis: {
			show: false,
			labels: {
				show: false,
			},
			title: {
				text: "",
				style: {
					fontSize: "0",
				},
			},
		},
		title: {
			show: false,
			text: "",
			align: "center",
			style: {
				fontSize: "0",
			},
		},
	};

	updateApexChart("chart", webViewRef, iframeRef, [], options);
};
