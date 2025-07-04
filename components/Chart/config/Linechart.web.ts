const iframeLineHtmlContent = /*html*/ `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0 />
        <title>Line Apex Chart for iFrame</title>
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
                position: absolute;
                width: 99%;
                touch-action: none;
                padding-top:10px;
            }
            .apexcharts-element-hidden {
                opacity: 1 !important;
                visibility: visible !important;
            }

            .apexcharts-tooltip .apexcharts-tooltip-title {
                font-weight: bold;
            }
            .svg_select_handle_r,
            .svg_select_handle_l {
                display: none;
            }
            
        </style>
    </head>
    <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div id="chart" style="width: 95%; height: 100%; overflow: hidden;"></div>
        <script>

            let chart;
            let isZoomed = false;
            let yaxisTitle="";
            let updatedLocale;
            let markersVisible = false;
            let activeTab = "";

            const isInIframe = window.self !== window.top;
            const isInRNWebView = typeof window?.ReactNativeWebView !== 'undefined';
            const isElectron = navigator.userAgent.toLowerCase().includes('electron');
                

            if (isInIframe) {
            console.log("Running inside an iframe",isElectron);
            } else if (isInRNWebView) {
            console.log("Running inside an Webview");
            }else{
            console.log("not in ifram nor webview");
            }


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

                chart.updateOptions({
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
                chart.updateSeries(chart.w.config.series);
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

            // zoom funtions to send msg about zoomed or not
            function isChartZoomed() {
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
            function setChartZoomedState(zoomed) {
                isZoomed = zoomed;
                console.log("Zoomed state is set to:", isZoomed);
            };

            // Function to reset zoom based on the zoomed state
            function resetZoom() {
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

            function ResetData() {
                chart.resetSeries();
            }

            //Update chart options and series
            function updateChart(filteredData, updatedOptions, title = "Energy Use") {
                if (filteredData.length === 0) {
                    sendMsgToWeb("Empty Series");
                }
                chart.updateSeries([{ name: title, data: filteredData }]);
                chart.updateOptions(updatedOptions);
                if (chart.w.config.series.length === 1) {
                    window.parent.postMessage("Empty", "*");
                }
            }

            function updateChartSeries(filteredData, title = "Energy Use") {
                if (filteredData.length === 0) {
                    sendMsgToWeb("Empty Series");
                }
                chart.updateSeries([{ name: title, data: filteredData }]);
            }

            function updateChartOptions(updatedOptions) {
                chart.updateOptions(updatedOptions);
            }

            //Highlight Annotations
            function highlightMinAndMax(chartInstance) {
                if (!chartInstance?.w?.config?.series?.[0]?.data) {
                    console.log("Invalid chart instance or missing data");
                    return;
                }

                const seriesData = chartInstance.w.config.series[0].data;

                if (!Array.isArray(seriesData) || seriesData.length === 0) {
                    //  Invalid or empty series data
                    return;
                }


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

            
            function updateLocale(newLocale=updatedLocale,yAxisTitle=yaxisTitle) {

                yaxisTitle=yAxisTitle;
                updatedLocale=newLocale;

                // tooltip min/max
                let yValues = chart.w.config.series[0].data.map((point) => point.y);
                let maxY = Math.max(...yValues);
                let minY = Math.min(...yValues);
                // Find indices of max and min values
                let maxIndex = yValues.indexOf(maxY);
                let minIndex = yValues.indexOf(minY);
                
                // title based on locale
                let currentSeries = chart.w.config.series;
                currentSeries[0].name = newLocale === "de" ? "Energieverbrauch: " : "Energy Use: ";
                
                let MAX = newLocale === "de" ? "  Maximal" : "  Maximum";
                let MIN = newLocale === "de" ? "  Minimum" : "  Minimum";
                
                
                chart.updateOptions({
                    tooltip: {
                        y: {
                            formatter: (value) => {
                                const formatter = new Intl.NumberFormat(newLocale === "de" ? "de-DE" : "en-IN", { maximumFractionDigits: 3 });
                                return formatter.format(value) + " " + yAxisTitle;
                            },
                        },
                        x: {
                            show: true,
                            formatter: (value,{ series, seriesIndex, dataPointIndex, w }) => {
                                const date = new Date(value);
                                const formattedDate = date.toLocaleString(newLocale === "de" ? "de-DE" : "en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    // timeZone: "Europe/Berlin",
                                });
                                if (dataPointIndex === maxIndex) return formattedDate + MAX;
                                if (dataPointIndex === minIndex) return formattedDate + MIN;
                                return formattedDate;
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
                        },
                        axisTicks: {
                            show: true,
                        },
                        axisBorder: {
                            show: true,
                        },
                    },
                    yaxis: {
                        min: function (min) {
						    return min - (min * 0.1);
					    },
					    max: function (max) {
						    return max + (max * 0.1);
					    },
                        forceNiceScale: true,
                        title: {
                            show:true,
                            text: yAxisTitle,
                        },
                        labels: {
                            show: true,
                            style: {
                                fontSize: "12px",
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontWeight: 500,
                            },
                            formatter: (value) => {
                                const locale = newLocale === "de" ? "de-DE" : "en-IN";
                                return new Intl.NumberFormat(locale, {
                                    maximumFractionDigits: 0,
                                }).format(value);
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
                });
            };

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
                chart.updateSeries(chart.w.config.series);
            }

            var options = {
                series: [],
                chart: {
                    height: "90%",
                    type: "line",
                    offsetX: 0,
                    offsetY: 30,
                    // background: "url('https://i.ibb.co/ryQkmKq/new.png') no-repeat center center",
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
                        enabled: true,
                    },
                    events: {
                        updated: function (chartContext) {
                            sendMsgToWeb("Chart updated");
                            highlightMinAndMax(chartContext);
                        },

                        mounted: function (chartContext) {
                            updateToggleMarker();
                            sendMsgToWeb("mounted");

                            const chartEl = document.querySelector(".apexcharts-canvas");

                            if (chartEl) {
                                chartEl.addEventListener(
                                    "touchstart",
                                    () => {}, // Or your handler
                                    { passive: true }
                                );
                                chartEl.addEventListener(
                                    "touchmove",
                                    () => {}, // Or your handler
                                    { passive: true }
                                );
                                chartEl.addEventListener(
                                    "wheel",
                                    () => {}, // Or your handler
                                    { passive: true }
                                );
                            }
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
                        animationEnd: function (chartContext, { xaxis, yaxis }) {
                            sendMsgToWeb("animationEnd");
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
                            selection: true
                        },
                        export: {
                            scale: undefined,
                            width: undefined,
                            csv: {
                                filename: "cockpit_csv",
                                columnDelimiter: ',',
                                headerCategory: 'Date, Time',
                                headerValue: 'KHW',
                                categoryFormatter(x) {
                                    const date = new Date(x);
                                    const pad = (n) => n.toString().padStart(2, '0');
                                    return updatedLocale === "en"
                                        ? '="' + date.getFullYear() + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getDate()) + '",' +
                                        '="' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '"'
                                        : '="' + date.getFullYear() + '.' + pad(date.getMonth() + 1) + '.' + pad(date.getDate()) + '",' +
                                        '="' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '"';
                                },
                                valueFormatter(y) {
                                    const formattedY = new Intl.NumberFormat(updatedLocale, {
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
                    fillOpacity: 1,
                    discrete: [],
                    shape: "circle",
                    offsetX: 0,
                    offsetY: 0,
                    onClick: undefined,
                    onDblClick: undefined,
                    showNullDataPoints: false,
                    hover: {
                        size: 5,
                        sizeOffset: 4,
                    },
                },
                fill: {
                    colors: ["#e31837"],
                    //gradient: {
                    //    shadeIntensity: 1,
                    //    inverseColors: false,
                    //    opacityFrom: 0.2,
                    //    opacityTo: 0,
                    //},
                    opacity: 1,
                    type: 'solid',
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
                        text: "-",
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
                                 height: 550,
                                // background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
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
                                height: "90%",
                                // background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
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
                                height: "90%",
                                // background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
                                toolbar: {
                                    show: true,
                                    offsetX: 2,
                                    offsetY: 0,
                                    autoSelected: "zoom",
                                    tools: {
                                        download: true,
                                        selection: false,
                                        zoom: true,
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
                                },
                            },
                        },
                    },
                ],
            };

            
            (function () {
                const originalAddEventListener = EventTarget.prototype.addEventListener;

                EventTarget.prototype.addEventListener = function (type, listener, options) {
                    const passiveEvents = ["touchstart", "touchmove", "wheel"];

                    if (passiveEvents.includes(type)) {
                        if (typeof options === "boolean") {
                            // Convert boolean to options object
                            options = { passive: true, capture: options };
                        } else if (typeof options === "object" && options !== null) {
                            // Force passive to true
                            options = { ...options, passive: true };
                        } else {
                            options = { passive: true };
                        }
                    }

                    return originalAddEventListener.call(this, type, listener, options);
                };
            })();

            chart = new ApexCharts(document.querySelector("#chart"), options);
            chart
                .render()
                .then(() => {
                        chart.w.globals.isTouchDevice = false;
                })
                .catch((error) => {
                        console.error("Chart failed to render:", error);
                });;
        </script>
    </body>

</html>`;
export default iframeLineHtmlContent;
