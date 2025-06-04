const webviewAreaHtmlContent = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
        <title>Donut Chart with ApexCharts for webview</title>	
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
                width: 99%;
                position: absolute;
                touch-action: none;
            }
			.apexcharts-tooltip .apexcharts-tooltip-title {
  				font-weight: bold;
			}
        </style>
    </head>
    <body>
        <div id="chart"></div>
        <script>
            function sendMsgToReactNative(action, values = null) {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                        action: action,
                        values: values,
                    })
                );
            }

            var locale, title="", categories;

            //generate locale months
            function getLocalizedMonths(locale = "en-US", type = "short") {
                try {
                    const formatter = new Intl.DateTimeFormat(locale, {
                        month: type,
                    });
                    const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));
                    return months;
                } catch (error) {
                    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                }
            }

            categories = getLocalizedMonths("en-IN"); // Default locale

            // Function to update the chart's locale
            function updateLocale(newLocale = "en-IN", newTitle=title) {
                title = newTitle;
                locale = newLocale;
                categories = getLocalizedMonths(newLocale);
                chart.updateOptions({
                    xaxis: {
                        categories: categories,
                    },
                    title: { text: "Target " + newTitle },
                });
            }

            var options = {
                series: [],
                colors: ["#C2C1C3", "#DFDFDF", "#A4A4A5", "#E31837"],
                chart: {
                    height: "100%",
                    width: "100%",
                    type: "area",
                    offsetX: -5,
                    offsetY: 0,
                    zoom: {
                        enabled: true,
                        type: "x",
                        autoScaleYaxis: true,
                    },
                    // background:" url('https://www05.enexion-sys.de/img/dotnetchart/default_large_chart.png') no-repeat center center / 500px 500px",
                    toolbar: {
                        show: false,
                        offsetX: 0,
                        offsetY: 0,
                        autoSelected: "zoom",
                        tools: {
                            download: true,
                            selection: false,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: false,
                            reset: true,
                        },
                    },
                    animations: {
                        enabled: true,
                        easing: "linear",
                        speed: 1000,
                        dynamicAnimation: { enabled: true, speed: 1000 },
                        animategradually: { enabled: true, delay: 1000 },
                        initialAnimation: { enabled: true, delay: 1000 },
                    },
                    events: {
                        selection: function (chartContext, { xaxis, yaxis }) {
                            sendMsgToReactNative("selection", [xaxis, yaxis]);

                            const currentMin = chart.w.globals.minX;
                            const currentMax = chart.w.globals.maxX;

                            const zoomAmount = (currentMax - currentMin) * 0.3;

                            // Ensure the new zoomed range stays within the series bounds
                            const newMinX = Math.max(
                                currentMin - zoomAmount,
                                chart.w.globals.seriesX[0][0] // Series minimum
                            );
                            const newMaxX = Math.min(
                                currentMax + zoomAmount,
                                chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] // Series maximum
                            );
                            
                            // Update chart optionsata no
                            chart.updateOptions({
                                xaxis: {
                                    min: newMinX,
                                    max: newMaxX,
                                    
                                },
                            });
                            updateLocale(locale, title);
                        },
                        animationEnd: function (chartContext, { xaxis, yaxis })
                        {
						    sendMsgToReactNative("animationEnd Area");
					    },

                        mouseMove: function () {
                            sendMsgToReactNative("mouseMove");
                            handleChartMouseMove();
                        },

                        mouseLeave: function () {
                            sendMsgToReactNative("mouseLeave");
                        },

                        click: function () {
                            sendMsgToReactNative("click");
                        },

                        legendClick: function () {
                            sendMsgToReactNative("legendClick");
                        },

                        markerClick: function () {
                            sendMsgToReactNative("markerClick");
                        },

                        xAxisLabelClick: function () {
                            sendMsgToReactNative("xAxisLabelClick");
                        },
                        beforeResetZoom: function () {
                            sendMsgToReactNative("beforeResetZoom");
                        },

                        zoomed: function () {
                            sendMsgToReactNative("chartZoomed", null, null, true);
                            sendMsgToReactNative("Zoomed");
                        },

                        beforeMount: function () {
                            sendMsgToReactNative("beforeMount");
                        },

                        mounted: function (chartContext) {
                            sendMsgToReactNative("mounted");
                            highlightMinAndMax(chartContext);
                            document.querySelector(".apexcharts-canvas")?.addEventListener("touchstart", (e) => { }, { passive: true });
                        },

                        dataPointSelection: function () {
                            sendMsgToReactNative("dataPointSelection");
                        },

                        updated: function (chartContext) {
                            sendMsgToReactNative("Area Chart updated");
                            highlightMinAndMax(chartContext);
                        },
                    },
                },
                title: {
                    text: "",
                    align: "center",
                    margin: 0,
                    offsetX: 15,
                    offsetY: 20,
                    style: {
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#7f7f7f",
                    },
                },
                noData: {
                    text: "",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: -40,
                    style: {
                        color: "#898a8c",
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: "straight",
                    width: 1,
                },
                markers: {
                    size: 0,
                    // colors: "#e31837",
                    strokeColors: "white",
                    strokeWidth: 1,
                    strokeOpacity: 0.7,
                    strokeDashArray: 0,
                    fillOpacity: 2,
                    discrete: [],
                    shape: "circle",
                    offsetX: 0,
                    offsetY: 0,
                    onClick: undefined,
                    onDblClick: undefined,
                    showNullDataPoints: true,
                    hover: {
                        size: 4,
                        sizeOffset: 5,
                    },
                },
                xaxis: {
                    type: "category",
                    categories,
                    labels: {
                        show: true,
                        position: "top",
                        textAnchor: "start",
                        // rotate: -90,
                        // rotateAlways: true,
                        hideOverlappingLabels: true,
                        showDuplicates: false,
                        trim: false,
                        maxHeight: 120,
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                            fontSize: "9px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 900,
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
                    show: true,
                    showAlways: false,
                    showForNullSeries: true,
                    seriesName: undefined,
                    opposite: false,
                    reversed: false,
                    logarithmic: false,
                    logBase: 0,
                    tickAmount: undefined,
                    min: undefined,
                    max: undefined,
                    // stepSize: 5,
                    forceNiceScale: false,
                    floating: false,
                    decimalsInFloat: undefined,
                    title: { text: "MW" },
                    labels: {
                        show: true,
                        minWidth: 0,
                        maxWidth: 160,
                        style: {
                            fontSize: "10px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                        },
                        offsetX: 0,
                        offsetY: 0,
                        formatter: (value) =>
                            new Intl.NumberFormat("en-EN", {
                                maximumFractionDigits: 0,
                            }).format(value),
                    },
                    axisBorder: {
                        show: false,
                        color: "#78909C",
                        offsetX: 0,
                        offsetY: 0,
                    },
                    axisTicks: {
                        show: true,
                        borderType: "solid",
                        color: "#78909C",
                        width: 1,
                        offsetX: -5,
                        offsetY: 0,
                    },
                },
                grid: {
                    show: true,
                    borderColor: "#ccc",
                    strokeDashArray: 0,
                    position: "back",
                    padding: {
                        top: 0,
                        right: -1,
                        bottom: 0,
                        left: 5,
                    },
                },
                fill: {
                    type: "solid",
                    opacity: [0.9, 0.8, 0.5, 0.1],
                },
                // stroke: {
                //     width: [0, 5, 0, 3],
                //     curve: "straight",
                // },
                // fill: {
                //     type: "solid",
                //     opacity: [0.2, 1, 0.5, 0]
                // },
                legend: {
                    show: true,
                    position: "bottom",
                    markers: {
                        shape: "line",
                        size: 10,
                        strokeWidth: 5,
                        offsetX: 0, // Adjust the position slightly
                    },
                },
                tooltip: {
                    enabled: true,
                    shared: true,
                    followCursor: false,
                    intersect: false,
                    inverseOrder: false,
                    hideEmptySeries: false,
                    fillSeriesColor: false,
                    // theme: true,
                    style: {
                        fontSize: "8px",
                        fontFamily: "Arial, sans-serif",
                        background: "#333",
                        color: "#fff",
                        borderRadius: "100px",
                        padding: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                    onDatasetHover: {
                        highlightDataSeries: true,
                    },
                    x: {
                        show: true,
                        format: "MMMM", // Display full month names
                        formatter: (value) => {
                            const months = getLocalizedMonths(locale, "long");
						
                            return months[value] + "  " + title;
                        },
                    },
                    y: {
                        //formatter: (value) => value + " MW", // Add 'MW' unit after y-axis value
                        formatter: function (value) {
                            const formattedValue = new Intl.NumberFormat(locale).format(value);
                            return formattedValue + " MW";
                        },
                        title: {
                            formatter: (seriesName) => seriesName, // Use the series name as the title (optional)
                        },
                    },
                    z: {
                        formatter: undefined,
                        title: "Size: ",
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
            };

            // toggle tooltip of chart or marker
            function toggleMarkers() {
                // Start loader
                sendMsgToReactNative("startLoader");
                const currentSize = chart.w.config.markers.size;
                const newSize = currentSize === 0 ? 3 : 0;
                // Update chart options
                chart.updateOptions({
                    markers: {
                        size: newSize,
                    },
                });
                // Stop loader after chart update
                sendMsgToReactNative("stopLoader");
                updateLocale();
            }

            //update chart series and options
            function updateChart(filteredData, updatedOptions) {
                chart.updateSeries(filteredData);
                chart.updateOptions(updatedOptions);
                sendMsgToReactNative("updateChart");
            }

            //update chart series
            function updateChartSeries(filteredData) {
                chart.updateSeries(filteredData, true);
                sendMsgToReactNative("updateChartSeries");
            }

            //update chart options
            function updateChartOptions(updatedOptions) {
                chart.updateOptions(updatedOptions);
                sendMsgToReactNative("updateChartOptions");
            }

            //reset chart series
            function resetChartSeries() {
                chart.resetSeries();
                sendMsgToReactNative("resetChartSeries");
            }

            //append chart series
            function appendChartData(data) {
                chart.appendData(data);
            }

            // Export the chart as a PNG image
            async function exportChart() {
                try {
                    const dataURI = await chart.dataURI(); // Get Base64 of chart
                    sendMsgToReactNative(dataURI.imgURI); // Send to React Native
                } catch (error) {
                    console.error("Error exporting chart:", error);
                }
            }
            window.exportChart = exportChart;
            // Helper functions to get first and last data points
            function getFirstDataPoint() {
                const series = chart.w.config.series[0].data;
                return series.length > 0 ? series[0] : null;
            }            

            function getLastDataPoint() {
                const series = chart.w.config.series[0].data;
                return series.length > 0 ? series[series.length - 1] : null;
            }            
            function getCurrentXRange() {
                return {
                    min: chart.w.globals.minX,
                    max: chart.w.globals.maxX,
                };
            }

            function getFullDataRange() {
                const seriesX = chart.w.globals.seriesX[0];
                return {
                    min: seriesX[0],
                    max: seriesX[seriesX.length - 1],
                };
            }

            // zoomin
            function zoomIn1() {
                if (!chart?.w?.globals) {
                    console.warn("Zoom In action skipped: chart or required properties not available.");
                    return;
                }

                sendMsgToReactNative("Zoom Start");

                const currentRange = getCurrentXRange();
                const range = currentRange.max - currentRange.min;
                const newRange = range * 0.7; // Zoom in by 30%
                const center = currentRange.min + range / 2;

                const fullRange = getFullDataRange();
                const newMin = Math.max(fullRange.min, center - newRange / 2);
                const newMax = Math.min(fullRange.max, center + newRange / 2);

                chart.zoomX(newMin, newMax);
                
            }
            //Zoom out
            function zoomOut1() {
                if (!chart?.w?.globals) {
                    console.warn("Zoom Out action skipped: chart or required properties not available.");
                    return;
                }

                sendMsgToReactNative("Zoomed");

                const currentRange = getCurrentXRange();
                const range = currentRange.max - currentRange.min;
                const newRange = range * 1.3; // Zoom out by 30%
                const center = currentRange.min + range / 2;

                const fullRange = getFullDataRange();
                const newMin = Math.max(fullRange.min, center - newRange / 2);
                const newMax = Math.min(fullRange.max, center + newRange / 2);

                chart.zoomX(newMin, newMax);
            }

            //New Optimized Function
            //zoomIn
            function zoomIn() {
                if (!chart?.w?.globals) {
                    console.warn("Zoom In action skipped: chart or required properties not available.");
                    return;
                }

                sendMsgToReactNative("Zoom In");

                const currentRange = getCurrentXRange();
                const fullRange = getFullDataRange();

                const minX = currentRange.min;
                const maxX = currentRange.max;

                const center = (minX + maxX) / 2;

                // Zoom in by moving min/max halfway toward the center (50% zoom)
                let newMin = (minX + center) / 2;
                let newMax = (maxX + center) / 2;

                // Clamp newMin and newMax to data bounds
                newMin = Math.max(fullRange.min, newMin);
                newMax = Math.min(fullRange.max, newMax);

                chart.zoomX(newMin, newMax);
            }
            //zoomOut
            function zoomOut() {
                if (!chart?.w?.globals) {
                    console.warn("Zoom Out action skipped: chart or required properties not available.");
                    return;
                }

                sendMsgToReactNative("Zoomed Out");

                const currentRange = getCurrentXRange();
                const fullRange = getFullDataRange();
                const minX = currentRange.min;
                const maxX = currentRange.max;
                const center = (minX + maxX) / 2;

                // Zoom out by moving min/max away from center (double the distance from center)
                // Calculate new min by reflecting minX further away from center
                let newMin = center - (center - minX) * 2;
                
                // Calculate new max by reflecting maxX further away from center
                let newMax = center + (maxX - center) * 2;

                // Clamp newMin and newMax to data bounds
                newMin = Math.max(fullRange.min, newMin);
                newMax = Math.min(fullRange.max, newMax);

                chart.zoomX(newMin, newMax);
            }

            //resetzoom
            function resetZoom() {
                const fullRange = getFullDataRange();
                chart.zoomX(fullRange.min, fullRange.max);
            }

            //left pan
            function customPanLeft() {
                if (!chart?.w?.globals) {
                    console.warn("Pan Left action skipped: chart or required properties not available.");
                    return;
                }

                const fullRange = getFullDataRange();
                const currentRange = getCurrentXRange();
                const range = currentRange.max - currentRange.min;
                const moveFactor = range * 0.5;

                const newMin = Math.max(fullRange.min, currentRange.min - moveFactor);
                const newMax = newMin + range;

                chart.zoomX(newMin, newMax);
                
            }

            //right pan
            
            function customPanRight() {
                if (!chart?.w?.globals) {
                    console.warn("Pan Right action skipped: chart or required properties not available.");
                    return;
                }

                const fullRange = getFullDataRange();
                const currentRange = getCurrentXRange();
                const range = currentRange.max - currentRange.min;
                const moveFactor = range * 0.5;

                const newMax = Math.min(fullRange.max, currentRange.max + moveFactor);
                const newMin = newMax - range;

                chart.zoomX(newMin, newMax);
                
            }

                
            //toggle zoom and selection
            window.toggleZoomAndSelection = () => {
                if (chart.w.globals.zoomEnabled) {
                    // Switch to Selection mode
                    chart.w.globals.zoomEnabled = false;
                    chart.w.globals.selectionEnabled = true;
                } else if (chart.w.globals.selectionEnabled) {
                    // Switch to Zoom mode
                    chart.w.globals.zoomEnabled = true;
                    chart.w.globals.selectionEnabled = false;
                } else {
                    // Default to Zoom mode if neither is enabled
                    chart.w.globals.zoomEnabled = true;
                    chart.w.globals.selectionEnabled = false;
                }
            };

            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();
        </script>
    </body>
</html>
`;

export default webviewAreaHtmlContent;
