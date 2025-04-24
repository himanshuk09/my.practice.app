const iframeDonutChartHtmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Donut Chart with ApexCharts for iframe</title>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<style>
		#donut-chart {
			touch-action: none;
			overflow: hidden;
			height: "100%";
			width: "100%";
		}
	</style>
</head>

<body>
	<div id="donut-chart"></div>

	<script>

		var activeIndex = null; // Track the active dataset index
		let donutchart;

		function sendMsgToWeb(message) {
			const payload = typeof message === "object" ? { ...message, source: "donut-chart" } : { message, source: "donut-chart" };
			try {
				window.parent.postMessage(payload, "*");
			} catch (error) {
				console.error("Failed to post message from", error);
			}
		}

		//...Update chart options and series
		function updateChart(filteredData, updatedOptions) {
			donutchart.updateSeries(filteredData, true);
			donutchart.updateOptions(updatedOptions);
			sendMsgToWeb("updateChart");
		}

		function updateChartSeries(filteredData) {
			donutchart.updateSeries(filteredData, true);
			sendMsgToWeb("updateChartSeries");
		}

		function updateChartOptions(updatedOptions) {
			donutchart.updateOptions(updatedOptions);
			sendMsgToWeb("updateChartOptions");
		}

		function resetChartSeries() {
			donutchart.resetSeries();
		}

		function appendChartData(data) {
			donutchart.appendData(data);
		}

		function updateLocale(locale) {
			sendMsgToWeb("updateChart locale");
			donutchart.updateOptions(
				{
					plotOptions: {
						pie: {
							donut: {
								labels: {
									value: {
										formatter: function (val) {
											// Handle cases where val might be undefined/null
											if (val === null || val === undefined) return "0%";

											return new Intl.NumberFormat(locale, {
												style: "percent",
												minimumFractionDigits: 0,
												maximumFractionDigits: 2,
											}).format(val / 100);
										},
									},
								},
							},
						},
					},
				},
				true,
				true
			); // (newOptions, redraw, animate)
		}



		var options = {
			series: [10, 50],// initial data for animation
			chart: {
				type: "donut",
				height: "120%",
				width: "100%",
				background: "none",
				animations: {
					enabled: true,
					easing: "easeout", // Try "easeout" or "linear" for smoother transitions
					speed: 1000, // Reduce the main animation speed
					dynamicAnimation: { enabled: true, speed: 1500 },
					animateGradually: { enabled: true, delay: 500 },
					initialAnimation: { enabled: true },
				},
				toolbar: { show: false },
				events: {
					dataPointSelection: function (event, chartContext, config) {
						var clickedIndex = config.dataPointIndex;
						if (activeIndex === clickedIndex) {
							activeIndex = null;
							chartContext.updateOptions(
								{
									plotOptions: {
										pie: {
											donut: {
												labels: {
													show: false,
												},
											},
										},
									},
								},
								false,
								false
							);
						} else {
							activeIndex = clickedIndex;
						}
					},

					dataPointMouseLeave: function (event, chartContext, config) {
						if (activeIndex !== null) {
							donutchart.toggleDataPointSelection(activeIndex);
							activeIndex = null;
						}
						chartContext.updateOptions(
							{
								plotOptions: {
									pie: {
										donut: {
											labels: {
												show: true,
											},
										},
									},
								},
							},
							false,
							false
						);
					},
				},
			},
			colors: ["#7f7f7f", "#e31837"],
			labels: ["Open", "Closed"],
			noData: {
				text: "",
				align: "center",
				verticalAlign: "middle",
				offsetX: 0,
				offsetY: -10,
				style: {
					color: "#7f7f7f",
					fontSize: "25px",
					fontWeight: "600",
					fontFamily: "Helvetica, Arial, sans-serif",
				},
			},
			plotOptions: {
				pie: {
					expandOnClick: false,
					startAngle: 0,
					endAngle: 360,
					donut: {
						labels: {
							show: true,
							name: {
								show: true,
								fontSize: "15px",
								fontFamily: "Helvetica, Arial, sans-serif",
								fontWeight: 600,
								color: undefined,
								offsetY: -10,
								formatter: function (val) {
									return val;
								},
							},
							value: {
								show: true,
								fontSize: "15px",
								fontFamily: "Helvetica, Arial, sans-serif",
								fontWeight: 500,
								color: undefined,
								offsetY: -5,
								offsetX: -5,

								formatter: function (val) {
									if (val === null || val === undefined) return "0%";
									return new Intl.NumberFormat("en", {
										style: "percent",
										minimumFractionDigits: 0,
										maximumFractionDigits: 2,
									}).format(val / 100);
								},
							},
							total: {
								show: false,
							},
						},
					},
				},
			},
			tooltip: {
				enabled: false, // Disable tooltip
			},
			dataLabels: {
				enabled: false, // Disable data labels
			},
			legend: {
				show: false, // Disable legend
			},
			fill: {
				type: "gradient",
			},
			title: {
				text: "",
				align: "center",
				style: {
					fontSize: "14px",
					fontWeight: "600",
					color: "#7f7f7f",
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: { width: "100%", height: "100%" },
					},
				},
			],
		};


		sendMsgToWeb("iframeReady");

		donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
		donutchart.render();
	</script>
</body>

</html>`;
export default iframeDonutChartHtmlContent;
