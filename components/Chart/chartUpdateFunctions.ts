import { i18n } from "@/localization/config";
import { Platform } from "react-native";
type ChartUpdateType = "series" | "options" | "chart";
type chartTypeProps = "line" | "donut" | "area";

export const updateApexChart = ({
	type,
	webViewRef,
	iFrameRef,
	data,
	options,
}: {
	type: ChartUpdateType;
	webViewRef: any;
	iFrameRef: any;
	data: any;
	options: any;
}) => {
	if (Platform.OS === "web") {
		const iframe = iFrameRef.current;
		if (iframe && iframe?.contentWindow) {
			switch (type) {
				case "series":
					iframe.contentWindow.updateChartSeries?.(data);
					break;
				case "options":
					iframe.contentWindow.updateChartOptions?.(options);
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
				jsCommand = `updateChartOptions(${JSON.stringify(options)});`;
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

export const updateEmptyApexChart = (
	webViewRef?: any,
	iFrameRef?: any,
	chartType?: chartTypeProps
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

	// updateApexChart("chart", webViewRef, iFrameRef, [], options);
	updateApexChart({
		type: "chart",
		webViewRef,
		iFrameRef,
		data: [],
		options,
	});
};

export const updateLineApexChartLocale = ({
	locale,
	yaxisunit,
	activeTab,
	webViewRef,
	iFrameRef,
}: {
	locale: string;
	yaxisunit: string;
	activeTab: string;
	webViewRef: any;
	iFrameRef: any;
}) => {
	if (Platform.OS === "web") {
		const iframe = iFrameRef.current;
		if (iframe?.contentWindow) {
			iframe.contentWindow.updateLocale?.(locale, yaxisunit, activeTab);
			iframe.contentWindow.updateFormate?.(activeTab, locale);
			iframe.contentWindow.setFileName?.("hello");
		}
	} else {
		const scripts = [
			`if (typeof updateLocale === 'function') updateLocale('${locale}','${yaxisunit}','${activeTab}');`,
			`if (typeof updateFormate === 'function') updateFormate('${activeTab}','${locale}');`,
		];
		scripts.forEach((script) => {
			webViewRef.current?.injectJavaScript(script);
		});
	}
};

export const updateAreaApexChartLocale = ({
	locale,
	date,
	fileName,
	webViewRef,
	iFrameRef,
}: {
	locale: string;
	date: string;
	fileName: string;
	webViewRef: any;
	iFrameRef: any;
}) => {
	const year = new Date(date).getFullYear();
	if (Platform.OS === "web") {
		const iframe = iFrameRef.current;
		if (iframe?.contentWindow) {
			iframe.contentWindow.updateLocale?.(locale, `${year}`);
			iframe.contentWindow.setFileName?.(fileName);
		}
	} else {
		const script = `if (typeof updateLocale === 'function') { updateLocale('${locale}', ${year}); }`;
		webViewRef.current?.injectJavaScript(script);
	}
};

export const updateDonutApexChartLocale = ({
	locale,
	webViewRef,
	iFrameRef,
}: {
	locale: string;
	webViewRef: any;
	iFrameRef: any;
}) => {
	if (Platform.OS === "web") {
		const iframe = iFrameRef.current;
		if (iframe?.contentWindow) {
			iframe.contentWindow.updateLocale?.(locale);
		}
	} else {
		const script = `if (typeof updateLocale === 'function') { updateLocale('${locale}'); }`;
		webViewRef.current?.injectJavaScript(script);
	}
};
