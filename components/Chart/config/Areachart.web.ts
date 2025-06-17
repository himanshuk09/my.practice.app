const iframeAreaHtmlContent = /*html*/ `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0 />
	<title>Donut Chart with ApexCharts for iFrame</title>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			height: 100vh;
			position: relative;
		}

		#chart {
			overflow: hidden;
			width: 100%;
			position: absolute;
			touch-action: none;
		}

        .apexcharts-tooltip .apexcharts-tooltip-title {
  			font-weight: bold;
		}
	</style>
</head>

<body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
	<div id="chart" style="width: 100%; height: 100%;"></div>
	<script>
		let chart;
		let localeAfterMount = "en";
		let titleAfterMount = "";
		let initialXAxisRange = {};
		let categories;
		let markersVisible = false; // Initial state

        function setFileName (newFileName){
            chart?.updateOptions({
				chart: {
					toolbar: {
						export: {
                            csv: {
                                filename: newFileName,
                            },
                            svg: {
                                filename: newFileName,
                            },
                            png: {
                                filename: newFileName,
                            }
                        }
					},
				},
			});
        }
        
		function updateToggleMarker() {
			const newSize = markersVisible ? 3 : 0;
			const newColor = markersVisible ? "red" : "gray";

			chart?.updateOptions({
				markers: {
					size: newSize,
				},
				chart: {
					toolbar: {
						tools: {
							customIcons: [
								{
									icon:
										'<span class="apexcharts-custom-icon" style="display:inline-block;width:12px;height:12px;border-radius:50%;background-color:' +
										newColor +
										';"></span>',
									title: "Toggle Markers",
									index: -8,
									class: "custom-icon-class custom-icon",
									click: function () {
										markersVisible = !markersVisible;
										updateToggleMarker(); // Reapply icon and marker state
									},
								},
							],
						},
					},
				},
			});
            updateLocale(localeAfterMount,titleAfterMount)
		}

		// send to web console
		function sendMsgToWeb(message, values = null) {
			const payload = typeof message === "object" ? { ...message, source: "line-chart", values } : { message, source: "line-chart", values };
			try {
				window.parent.postMessage(payload, "*");
			} catch (error) {
				console.error("Failed to post message from", error);
			}
		}

		//generate locale month
		function getLocalizedMonths(locale = "en-US") {
			try {
				const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
				const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));
				return months;
			} catch (error) {
				return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			}
		}

		categories = getLocalizedMonths("en-IN"); // Default locale

		// Function to update the chart's locale
		function updateLocale(newLocale = "en-IN", newTitle = "") {
			categories = getLocalizedMonths(newLocale);
			localeAfterMount = newLocale;
			titleAfterMount = newTitle;
			chart?.updateOptions({
				xaxis: {
					categories: categories,
				},
				title: { text: "Target " + newTitle },
			});
		}

		// Common function to handle both zoom and pan
		function handleZoomOrPan(chartContext, xaxis, yaxis) {
			const seriesX = chartContext.w.globals.seriesX[0] || []; // Ensure series exists

			if (seriesX.length < 2) {
				console.warn("Not enough data points to zoom or pan");
				return {
					xaxis: {
						min: chartContext.w.globals.minX,
						max: chartContext.w.globals.maxX,
					},
					yaxis,
				};
			}

			const seriesMin = seriesX[0];
			const seriesMax = seriesX[seriesX.length - 1];
			const minDistanceBetweenPoints = seriesX[1] - seriesX[0];

			const newMinX = Math.max(xaxis?.min ?? seriesMin, seriesMin);
			const newMaxX = Math.min(xaxis?.max ?? seriesMax, seriesMax);

			if (newMaxX - newMinX < minDistanceBetweenPoints) {
				return {
					xaxis: {
						min: chartContext.w.globals.minX,
						max: chartContext.w.globals.maxX,
					},
					yaxis,
				};
			}

			return {
				xaxis: {
					min: newMinX,
					max: newMaxX,
				},
				yaxis,
			};
		}

		//Update options and series
		function updateChart(filteredData, updatedOptions) {
			chart?.updateSeries(filteredData);
			chart?.updateOptions(updatedOptions);
		}

		function updateChartSeries(filteredData) {
			chart?.updateSeries(filteredData);
		}

		function updateChartOptions(updatedOptions) {
			chart?.updateOptions(updatedOptions);
		}

		function resetChartSeries() {
			chart?.resetSeries();
		}

		function appendChartData(data) {
			chart?.appendData(data);
		}

		var options = {
			series: [],
			colors: ["#C2C1C3", "#DFDFDF", "#A4A4A5", "#E31837"],
			chart: {
				height: "100%",
				type: "area",
				zoom: {
					enabled: true,
					type: "x",
				},
                selection:{
                    enabled: true,
                    type: 'x',
                },
                pan: {
					enabled: true,
					type: "xy",
					threshold: 0,
				},
				// background: "url('https://www05.enexion-sys.de/img/dotnetchart/default_large_chart.png') no-repeat center center",
				toolbar: {
					show: true,
					offsetX: 0,
					offsetY: 0,
					tools: {
						download: true,
						selection: true,
						zoom: true,
						zoomin: true,
						zoomout: true,
						pan: true,
					},
                    export: {
                        scale: undefined,
                        width: undefined,
                        csv: {
                            filename: "cockpit_csv",
                            columnDelimiter: ',',
                            headerCategory: 'Month',
                            headerValue: '',
                            categoryFormatter(x) {
                                return x
                            },
                            valueFormatter(y) {
                                const formattedY = new Intl.NumberFormat(localeAfterMount, {
                                        useGrouping: true,
                                        maximumFractionDigits: 2,
                                        roundingMode: "floor",
                                        localeMatcher: "best fit",
                                        signDisplay: "auto",
                                        style: "decimal",
                                    }).format(y);

                                 const safeY = formattedY.includes(",") ? '"' + formattedY + '"' : formattedY;
                                return safeY;
                            }
                        },
                        svg: {
                            filename: "cockpit_svg",
                        },
                        png: {
                            filename: "cockpit_png",
                        }
                    }
				},
				animations: {
					enabled: true,
					easing: "linear",
					speed: 1000,
					dynamicAnimation: { enabled: true, speed: 1000 },
					animategradually: { enabled: true, delay: 2000 },
					initialAnimation: { enabled: true },
				},
				events: {
					mounted: function (chartContext) {
						setTimeout(() => {
							initialXAxisRange.min = chartContext.w.globals.minX;
							initialXAxisRange.max = chartContext.w.globals.maxX;
						}, 1000);
						updateToggleMarker();
					},

					beforeZoom: function (chartContext, { xaxis, yaxis }) {
						updateLocale(localeAfterMount, titleAfterMount);
						return handleZoomOrPan(chartContext, xaxis, yaxis);
					},

					scrolled: function (chartContext, { xaxis, yaxis }) {
						chartContext?.updateOptions({
							xaxis: handleZoomOrPan(chartContext, xaxis, yaxis).xaxis,
						});
						updateLocale(localeAfterMount, titleAfterMount);
					},

					beforeResetZoom: function (chartContext) {
						chartContext?.updateOptions({
							xaxis: {
								min: "Jan",
								max: "Dec",
							},
							yaxis: {},
						});
						updateLocale(localeAfterMount, titleAfterMount);
					},
				},
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
			noData: {
				text: "",
				align: "center",
				verticalAlign: "middle",
				offsetX: 0,
				offsetY: 0,
				style: {
					color: "#7f7f7f",
					fontSize: "15px",
					fontWeight: "bold",
					fontFamily: "Helvetica, Arial, sans-serif",
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: "straight",
				width: 1, //['straight', 'smooth', 'monotoneCubic', 'stepline']
			},
			xaxis: {
				type: "category",
				categories,
                crosshairs: {
                    show: false,
                    width: 0,
                    position: "back",
                    opacity: 0.9,
                    stroke: {
                        color: "#b6b6b6",
                        width: 0,
                        dashArray: 1,
                    },
                    fill: {
                        type: "solid",
                        color: "#B1B9C4",
                        gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#BED1E6",
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                    dropShadow: {
                        enabled: false,
                        top: 0,
                        left: 0,
                        blur: 0,
                        opacity: 0.4,
                    },
                },
			},
			yaxis: {
				title: {
					text: "MW",
				},
			},
			legend: {
				show: true,
				position: "bottom",
				markers: {
					shape: "line",
					size: 10,
					width: 40,
					height: 1,
					strokeWidth: 7,
					offsetX: 0, // Adjust the position slightly
				},
			},
			fill: {
				type: "solid",
				opacity: [0.9, 0.8, 0.5, 0.1], // Adjust per dataset
			},
			tooltip: {
                enabled: true,
                shared: true,
                followCursor: false,
                intersect: false,
                inverseOrder: false,
                hideEmptySeries: false,
                fillSeriesColor: false,
                onDatasetHover: {
                    highlightDataSeries: true,
                },
                style: {
                    fontSize: "12px",
                    fontFamily: "Arial, sans-serif",
                    background: "#333",
                    color: "#fff",
                    borderRadius: "100px",
                    padding: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
				x: {
					show: true,
					format: "MMMM",
					formatter: (value) => {
						const months = getLocalizedMonths(localeAfterMount);
						return months[value - 1] + "  " + titleAfterMount;
					},
				},
				y: {
					formatter: function (value) {
						const formattedValue = new Intl.NumberFormat(localeAfterMount).format(value);
						return formattedValue + " MW";
					},
					title: {
						formatter: (seriesName) => seriesName,
					},
				},
                items: {
                    display: "flex",
                },
                fixed: {
                    enabled: false,
                    position: "topRight",
                    offsetX: 0,
                    offsetY: 0,
                },
                legend: {
                    markers: {
                        shape: "line",
                        offsetX: 0,
                    },
                },
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							height: "95%",
							type: "area",
							zoom: {
								enabled: true,
								type: "x",
							},
							// background: "url('https://www05.enexion-sys.de/img/dotnetchart/default_large_chart.png') no-repeat center center",
						},
					},
				},
                {
					// Small screens (Phones)
					breakpoint: 600, // For mobile phones
					options: {
						chart: {
							height: "90%",
							toolbar: {
								show: true,
								offsetX: 2,
								offsetY: 0,
								autoSelected: "zoom",
								tools: {
									download: true,
									selection: false,
									zoom: false,
									zoomin: true,
									zoomout: true,
									pan: false,
								},
							},
						},
					},
				},
			],
		};

		chart = new ApexCharts(document.querySelector("#chart"), options);
		chart?.render();
	</script>
</body>

</html>`;

export default iframeAreaHtmlContent;
