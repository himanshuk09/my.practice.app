const iframeLineHtmlContent = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0 />
        <title>Line Apex Chart for iFrame</title>
		<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    </head>
    <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div id="chart" style="width: 95%; height: 100%; overflow: hidden;"></div>
        <script>
            function sendMsgToWeb(message, values = null) {
                const payload = typeof message === "object" ? { ...message, source: "line-chart", values } : { message, source: "line-chart", values };
                try {
                    window.parent.postMessage(payload, "*");
                } catch (error) {
                    console.error("Failed to post message from", error);
                }
            }

            var options = {
                series: [{ name: "", data: [] }],
                chart: {
                    height: "90%",
                    type: "line",
                    offsetX: 0,
                    offsetY: 30,
                    background: "url('https://i.ibb.co/ryQkmKq/new.png') no-repeat center center",
                    backgroundSize: "cover",
                    stacked: false,
                    zoom: { type: "x", enabled: true, autoScaleYaxis: true },
                    animations: {
                        enabled: true,
                        easing: "linear",
                        speed: 500,
                        dynamicAnimation: {
                            enabled: true,
                            speed: 1000,
                        },
                        animategradually: {
                            enabled: true,
                            delay: 1000,
                        },
                        initialAnimation: {
                            enabled: false, // Enable initial animation if desired
                            speed: 1000, // Adjust the speed for initial loading animation
                        },
                    },
                    selection: {
                        enabled: false,
                    },
                    events: {
                        updated: function (chartContext) {
                            sendMsgToWeb("Chart updated");
                            highlightMinAndMax(chartContext);
                        },

                        mounted: function (chartContext) {
                            sendMsgToWeb("mounted");
                            document.querySelector(".apexcharts-canvas")?.addEventListener("touchstart", (e) => {}, { passive: true });
                        },

                        beforeZoom: function (chartContext, { xaxis, yaxis }) {
                            // Access the chart's series data
                            const seriesMin = chartContext.w.globals.seriesX[0][0]; // Minimum x-value in the dataset
                            const seriesMax = chartContext.w.globals.seriesX[0][chartContext.w.globals.seriesX[0].length - 1]; // Maximum x-value in the dataset

                            const minDistanceBetweenPoints = chartContext.w.globals.seriesX[0][1] - chartContext.w.globals.seriesX[0][0]; // Distance between two consecutive points

                            // Ensure at least one point is visible in the zoomed range
                            const newMinX = Math.max(xaxis.min, seriesMin);
                            const newMaxX = Math.min(xaxis.max, seriesMax);

                            if (newMaxX - newMinX < minDistanceBetweenPoints) {
                                // Prevent zooming if no point would be visible

                                return {
                                    xaxis: {
                                        min: chartContext.w.globals.minX,
                                        max: chartContext.w.globals.maxX,
                                    },
                                    yaxis,
                                };
                            }

                            // Allow zooming with validated values
                            return {
                                xaxis: {
                                    min: newMinX,
                                    max: newMaxX,
                                },
                                yaxis,
                            };
                        },
                    },

                    toolbar: {
                        show: true,
                        offsetX: 2,
                        offsetY: 10,
                        autoSelected: "zoom",
                        tools: {
                            download: true,
                            reset: true,
                            zoomin: true,
                            zoomout: true,
                            zoom: true,
                            pan: true,
                            selection: true,
                            customIcons: [
                                {
                                    icon: '<span class="apexcharts-custom-icon">🔘</span>',
                                    title: "Toggle Markers",
                                    index: -8,
                                    class: "custom-icon-class custom-icon",
                                    click: function () {
                                        sendMsgToWeb("startLoader");
                                        const currentSize = chart.w.config.markers.size;
                                        const newSize = currentSize === 0 ? 4 : 0;
                                        chart.updateOptions({
                                            markers: {
                                                size: newSize,
                                            },
                                        });
                                        // Update icon based on the newSize
                                        const newIcon = newSize === 0 ? '<span class="apexcharts-custom-icon">🔘</span>' : '<span class="apexcharts-custom-icon">⭕</span>';

                                        const iconElement = document.querySelector(".custom-icon-class");
                                        if (iconElement) {
                                            iconElement.innerHTML = newIcon;
                                        }
                                        sendMsgToWeb("stopLoader");
                                    },
                                },
                            ],
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },

                stroke: { curve: "straight", width: 2 }, //['straight', 'smooth', 'monotoneCubic', 'stepline']
                noData: {
                    text: "",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: -50,
                    style: {
                        color: "#898a8c",
                        fontSize: "25px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                    },
                },

                // grid: {
                // 	show: true,
                // 	borderColor: "#ccc",
                // 	strokeDashArray: 0,
                // 	position: "back",
                // 	row: {
                // 		colors: ["#e5e5e5", "transparent"],
                // 		opacity: 0.2,
                // 	},
                // 	column: {
                // 		colors: ["#f8f8f8", "transparent"],
                // 		opacity: 0.2,
                // 	},
                // 	xaxis: {
                // 		lines: {
                // 			show: true,
                // 		},
                // 	},
                // 	yaxis: {
                // 		lines: {
                // 			show: true,
                // 		},
                // 	},
                // 	padding: {
                // 		top: -20,
                // 		right: 15,
                // 		bottom: 0,
                // 		left: 13,
                // 	},
                // },
                annotations: {
                    points: [],
                },
                markers: {
                    size: 0,
                    colors: "#e31837",
                    strokeColors: "black",
                    strokeWidth: 0.7,
                    strokeOpacity: 0.2,
                    strokeDashArray: 0,
                    fillOpacity: 2,
                    discrete: [],
                    shape: "circle",
                    offsetX: 0,
                    offsetY: 0,
                    onClick: undefined,
                    onDblClick: undefined,
                    showNullDataPoints: false,
                    hover: {
                        size: undefined,
                        sizeOffset: 5,
                    },
                },
                fill: {
                    colors: ["#e31837"],
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.2,
                        opacityTo: 0,
                    },
                },
                xaxis: {
                    type: "datetime",
                    title: {
                        text: "Date / Time",
                        style: {
                            fontSize: "12px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                        },
                    },
                    labels: {
                        show: true,
                        rotate: 0,
                        rotateAlways: true,
                        textAnchor: "start",
                        hideOverlappingLabels: false,
                        showDuplicates: false,
                        trim: false,
                        maxHeight: 120,
                        offsetX: 5,
                        offsetY: 15,
                        style: {
                            fontSize: "12px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                        },
                        formatter: (value) => {
                            const date = new Date(value);
                            return date.toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                // timeZone: "Europe/Berlin",
                            });
                        },
                    },
                    axisBorder: {
                        show: true,
                        color: "#78909C",
                        height: 1,
                        width: "100%",
                        offsetX: 0,
                        offsetY: 0,
                    },
                    axisTicks: {
                        show: true,
                        borderType: "solid",
                        color: "#78909C",
                        height: 6,
                        offsetX: 0,
                        offsetY: 0,
                    },
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
                        text: "kWh",
                    },
                    labels: {
                        show: true,
                        minWidth: 0,
                        maxWidth: 160,
                        style: {
                            fontSize: "12px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 400,
                        },
                        offsetX: 0,
                        offsetY: 0,
                        formatter: (val) => {
                            return val.toLocaleString("en-IN");
                        },
                    },
                    axisBorder: {
                        show: false,
                        color: "#78909C",
                        offsetX: 0,
                        offsetY: 0,
                    },
                    axisTicks: {
                        show: false,
                        borderType: "solid",
                        color: "#78909C",
                        width: 6,
                        offsetX: 0,
                        offsetY: 0,
                    },
                },
                tooltip: {
                    enabled: true,
                    shared: true,
                    intersect: false,
                    onDatasetHover: {
                        highlightDataSeries: true,
                    },
                    x: {
                        show: true,
                        formatter: (value) => {
                            const date = new Date(value);
                            return date.toLocaleString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                // timeZone: "Europe/Berlin",
                            });
                        },
                    },
                    y: {
                        formatter: (val) => {
                            return val.toLocaleString("en-IN") + "kWh";
                        },
                    },
                },
                responsive: [
                    {
                        // Large screens (Laptops/Desktops)
                        breakpoint: 1000, // For laptop and large screens
                        options: {
                            chart: {
                                // height: 550,
                                background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
                                toolbar: {
                                    show: true,
                                    offsetX: 2,
                                    offsetY: 0,
                                    autoSelected: "zoom",
                                    tools: {
                                        download: true,
                                        reset: true,
                                        zoomin: true,
                                        zoomout: true,
                                        zoom: true,
                                        pan: true,
                                        selection: true,
                                    },
                                },
                            },
                        },
                    },
                    {
                        // Medium screens (Tablets)
                        breakpoint: 950, // For tablets and smaller laptops
                        options: {
                            chart: {
                                // height: 500,
                                background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
                                toolbar: {
                                    show: true,
                                    offsetX: 2,
                                    offsetY: 0,
                                    autoSelected: "zoom",
                                    tools: {
                                        download: true,
                                        selection: true,
                                        zoom: true,
                                        zoomin: true,
                                        zoomout: true,
                                        pan: true,
                                    },
                                },
                            },
                        },
                    },
                    {
                        // Small screens (Phones)
                        breakpoint: 600, // For mobile phones
                        options: {
                            chart: {
                                height: "88%",
                                background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
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
                            xaxis: {
                                type: "datetime",
                                labels: {
                                    tickAmount: 5,
                                    show: true,
                                    textAnchor: "start",
                                    hideOverlappingLabels: false,
                                    showDuplicates: false,
                                    trim: false,
                                    maxHeight: 120,
                                    offsetX: 5,
                                    style: {
                                        fontSize: "8px",
                                        fontFamily: "Helvetica, Arial, sans-serif",
                                    },
                                    formatter: (value) => {
                                        const date = new Date(value);
                                        return date.toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            // timeZone: "Europe/Berlin",
                                        });
                                    },
                                },
                            },
                            // yaxis: {
                            // 	title: {
                            // 		text: "kWh",
                            // 	},
                            // 	labels: {
                            // 		show: true,
                            // 		minWidth: 0,
                            // 		maxWidth: 160,
                            // 		style: {
                            // 			fontSize: "8px",
                            // 			fontFamily: "Helvetica, Arial, sans-serif",
                            // 			fontWeight: 400,
                            // 		},
                            // 		offsetX: 0,
                            // 		offsetY: 0,
                            // 		formatter: (val) => {
                            // 			return val.toLocaleString("en-IN");
                            // 		},
                            // 	},
                            // },
                            // grid: {
                            // 	show: true,
                            // 	borderColor: "#ccc",
                            // 	strokeDashArray: 0,
                            // 	position: "back",
                            // 	row: {
                            // 		colors: ["#e5e5e5", "transparent"],
                            // 		opacity: 0.2,
                            // 	},
                            // 	column: {
                            // 		colors: ["#f8f8f8", "transparent"],
                            // 		opacity: 0.2,
                            // 	},
                            // 	xaxis: {
                            // 		lines: {
                            // 			show: true,
                            // 		},
                            // 	},
                            // 	yaxis: {
                            // 		lines: {
                            // 			show: true,
                            // 		},
                            // 	},
                            // 	padding: {
                            // 		top: -25,
                            // 		right: 15,
                            // 		bottom: 0,
                            // 		left: 10,
                            // 	},
                            // },
                        },
                    },
                ],
            };
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();

            function updateChart(filteredData, updatedOptions, title = "Energy Use") {
                chart.updateSeries([{ name: title, data: filteredData }]);
                chart.updateOptions(updatedOptions);
                if (chart.w.config.series.length === 1) {
                    window.parent.postMessage("Empty", "*");
                }
            }

            function updateChartSeries(filteredData, title = "Energy Use") {
                chart.updateSeries([{ name: title, data: filteredData }]);
            }

            function updateChartOptions(updatedOptions) {
                chart.updateOptions(updatedOptions);
            }

            window.updateLocale = (newLocale) => {
                chart.updateOptions({
                    chart: {},
                    tooltip: {
                        y: {
                            formatter: (value) => {
                                const formatter = new Intl.NumberFormat(newLocale === "de" ? "de-DE" : "en-IN", { maximumFractionDigits: 3 });
                                return formatter.format(value) + " " + "kWh";
                            },
                        },
                        x: {
                            show: true,
                            formatter: (value) => {
                                const date = new Date(value);
                                return date.toLocaleString(newLocale === "de" ? "de-DE" : "en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    // timeZone: "Europe/Berlin",
                                });
                            },
                        },
                    },
                    xaxis: {
                        tickAmount: 5,
                        title: {
                            text: newLocale === "de" ? "Datum / Uhrzeit" : "Date / Time",
                            style: {
                                fontSize: "12px",
                                fontFamily: "Helvetica, Arial, sans-serif",
                            },
                        },
                        labels: {
                            show: true,
                            formatter: (value) => {
                                const date = new Date(value);
                                return date.toLocaleString(newLocale === "de" ? "de-DE" : "en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    // timeZone: "Europe/Berlin",
                                });
                            },
                        },
                        axisTicks: {
                            show: true,
                        },
                    },

                    yaxis: {
                        labels: {
                            show: true,
                            formatter: (value) => {
                                const locale = newLocale === "de" ? "de-DE" : "en-IN";
                                return value.toLocaleString(locale, { maximumFractionDigits: 0 });
                            },
                        },
                        axisBorder: {
                            show: false,
                            color: "#78909C",
                            offsetX: 0,
                            offsetY: 0,
                        },
                        axisTicks: {
                            show: false,
                            borderType: "solid",
                            color: "#78909C",
                            width: 6,
                            offsetX: 0,
                            offsetY: 0,
                        },
                        title: {
                            text: "kWh",
                        },
                    },
                });
            };

            //..........
            let isZoomed = false;

            window.isChartZoomed = function () {
                // Dynamically access the series and x-axis data from the chart instance
                const seriesData = chart.w.config.series[0].data;

                if (!seriesData || seriesData.length === 0) {
                    console.error("Series data is empty, unable to check zoom.");
                    return false;
                }

                // Get the initial x-axis range from the series data
                const initialMinX = seriesData[0][0]; // First x-axis value
                const initialMaxX = seriesData[seriesData.length - 1][0]; // Last x-axis value

                // Get the current x-axis range of the chart
                const currentMinX = chart.w.config.xaxis.min;
                const currentMaxX = chart.w.config.xaxis.max;

                // Check if the chart is zoomed by comparing the current range with the initial range
                if (currentMinX !== initialMinX || currentMaxX !== initialMaxX) {
                    isZoomed = true; // Zoomed state is true
                    return true;
                } else {
                    isZoomed = false; // Zoomed state is false
                    return false;
                }
            };

            // Function to set the zoomed state from outside the WebView
            window.setChartZoomedState = function (zoomed) {
                isZoomed = zoomed;
                console.log("Zoomed state is set to:", isZoomed);
            };

            // Function to reset zoom based on the zoomed state
            window.resetZoom = function () {
                // Dynamically access the series and x-axis data from the chart instance
                const seriesData = chart.w.config.series[0].data;

                if (!seriesData || seriesData.length === 0) {
                    console.error("Series data is empty, unable to reset zoom.");
                    return;
                }

                // Get the initial x-axis range from the series data
                const initialMinX = seriesData[0][0]; // First x-axis value
                const initialMaxX = seriesData[seriesData.length - 1][0]; // Last x-axis value

                // Get the current x-axis range of the chart
                const currentMinX = chart.w.config.xaxis.min;
                const currentMaxX = chart.w.config.xaxis.max;

                // If the chart is not zoomed, return without doing anything
                if (currentMinX === initialMinX && currentMaxX === initialMaxX) {
                    console.log("Chart is not zoomed, no reset needed.");
                    return;
                }

                // Proceed with resetting zoom if chart is zoomed
                chart.updateOptions({
                    xaxis: {
                        min: initialMinX,
                        max: initialMaxX,
                    },
                });

                // After resetting, set zoomed state to false
                isZoomed = false;
            };

            //............

            function updateFormate(type = "Week", locale = "en") {
                let newLocale = locale === "de" ? "de-DE" : "en-EN";
                chart.updateOptions({
                    xaxis: {
                        labels: {
                            formatter: (value) => {
                                const xAxisData = chart.w.globals.initialSeries[0].data;
                                const index = chart.w.globals.labels.indexOf(value);
                                const date = new Date(value);
                                let formatOptions = {};
                                switch (type) {
                                    case "Day":
                                        // formatOptions = {
                                        //     year: "numeric",
                                        //     month: "short",
                                        //     day: "2-digit",
                                        //     hour: "2-digit",
                                        //     minute: "2-digit",
                                        //     timeZone: "Europe/Berlin",
                                        // };
                                        if (index === 0) {
                                            formatOptions = {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                // hour: "2-digit",
                                                // minute: "2-digit",
                                                // timeZone: "Europe/Berlin",
                                            };
                                        } else {
                                            formatOptions = {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                // timeZone: "Europe/Berlin",
                                            };
                                        }
                                        break;
                                    case "Week":
                                    case "Month":
                                        formatOptions = {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            // timeZone: "Europe/Berlin",
                                        };
                                        break;
                                    default:
                                        formatOptions = {
                                            year: "numeric",
                                            month: "short",
                                            hour12: false,
                                            // timeZone: "Europe/Berlin",
                                        };
                                        break;
                                }

                                return date.toLocaleString(newLocale, formatOptions);
                            },
                        },
                    },
                });
            }
            function highlightMinAndMax(chartInstance) {
                if (!chartInstance?.w?.config?.series?.[0]?.data) {
                    console.log("Invalid chart instance or missing data");
                    return;
                }

                const seriesData = chartInstance.w.config.series[0].data;

                if (!Array.isArray(seriesData) || seriesData.length === 0) {
                    //  console.log("Invalid or empty series data");
                    return;
                }

                sendMsgToWeb("called");

                let minPoint,
                    maxPoint,
                    isArrayFormat = Array.isArray(seriesData[0]);

                if (isArrayFormat) {
                    minPoint = seriesData.reduce((min, p) => (p[1] < min[1] ? p : min), [Infinity, Infinity]);
                    maxPoint = seriesData.reduce((max, p) => (p[1] > max[1] ? p : max), [-Infinity, -Infinity]);
                } else if (seriesData[0].x !== undefined && seriesData[0].y !== undefined) {
                    minPoint = seriesData.reduce((min, p) => (p.y < min.y ? p : min), { x: Infinity, y: Infinity });
                    maxPoint = seriesData.reduce((max, p) => (p.y > max.y ? p : max), { x: -Infinity, y: -Infinity });
                } else {
                    console.warn("Unsupported data format in series");
                    return;
                }

                // Clear and annotate chart
                chartInstance.clearAnnotations();
                const annotationStyle = {
                    marker: {
                        size: isArrayFormat ? 8 : 5,
                        fillColor: "#e31837",
                        strokeColor: "#ffffff",
                        strokeWidth: isArrayFormat ? 2 : 1,
                    },
                    label: {
                        style: {
                            color: "#ff0000",
                            fontSize: isArrayFormat ? "12px" : "10px",
                        },
                    },
                };

                chartInstance.addPointAnnotation({
                    x: isArrayFormat ? minPoint[0] : new Date(minPoint.x).getTime(),
                    y: isArrayFormat ? minPoint[1] : minPoint.y,
                    ...annotationStyle,
                    label: { ...annotationStyle.label, text: "Min" },
                });

                chartInstance.addPointAnnotation({
                    x: isArrayFormat ? maxPoint[0] : new Date(maxPoint.x).getTime(),
                    y: isArrayFormat ? maxPoint[1] : maxPoint.y,
                    ...annotationStyle,
                    label: { ...annotationStyle.label, text: "Max" },
                });

                sendMsgToWeb("highLightedMaxMin", {
                    minX: isArrayFormat ? minPoint[0] : minPoint.x,
                    minY: isArrayFormat ? minPoint[1] : minPoint.y,
                    maxX: isArrayFormat ? maxPoint[0] : maxPoint.x,
                    maxY: isArrayFormat ? maxPoint[1] : maxPoint.y,
                });
            }

            function ResetData() {
                chart.resetSeries();
            }
            (function () {
                var originalAddEventListener = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function (type, listener, options) {
                    if (type === "touchstart" || type === "touchmove") {
                        options = options || {};
                        if (typeof options === "object") {
                            options.passive = true;
                        }
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                };
            })();
        </script>
    </body>
</html>
`

export default iframeLineHtmlContent
