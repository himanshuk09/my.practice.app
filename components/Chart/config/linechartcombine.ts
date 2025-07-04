export const combine = /*html*/ `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
    <title>Line Apex Chart for Webview</title>
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

        .apexcharts-selection-rect {
            transition: opacity 150ms ease-out;
            opacity: 1;
            pointer-events: none;
            fill: rgba(0, 123, 255, 0.3);
        }

        .svg_select_handle_r,
        .svg_select_handle_l {
            display: none;
        }
    </style>
</head>

<body>
    <div id="chart" style="width: 98%; height: 100%; overflow: hidden;"></div>
    <script>

        let chart;
        let activeTab = "", locale = "en";
        let yaxisTitle = "";
        let selectionHideTimeout;
        let isCurrentlySelecting = false;
        let isZoomed = false;
        let markersVisible = false;

        const isInIframe = window.self !== window.top;
        const isInRNWebView = typeof window?.ReactNativeWebView !== 'undefined';
        const isElectron = navigator.userAgent.toLowerCase().includes('electron');


        // send to outside
        function sendMessageOutside(action = null, values = null, reason = null, isZoomed = null) {

            if (isInIframe) {
                const payload = typeof action === "object" ? { ...action, source: "line-chart", values } : { message: action, source: "line-chart", values };
                try {
                    window.parent.postMessage(payload, "*");
                } catch (error) {
                    console.error("Failed to post message from", error);
                }
            } else {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                        action,
                        values,
                        reason,
                        isZoomed,
                    })
                );
            }
        }

        //--------------------IFRAME WEB -------------------//

        // for web or iframe
        function setFileName(newFileName) {
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

        // zoom funtions to send msg about zoomed or not
        function isChartZoomed() {
            const seriesData = chart.w.config.series[0].data;
            if (!seriesData || seriesData.length === 0) {
                console.error("Series data is empty, unable to check zoom.");
                return false;
            }
            const initialMinX = seriesData[0][0];
            const initialMaxX = seriesData[seriesData.length - 1][0];
            const currentMinX = chart.w.config.xaxis.min;
            const currentMaxX = chart.w.config.xaxis.max;
            if (currentMinX !== initialMinX || currentMaxX !== initialMaxX) {
                isZoomed = true;
                return true;
            } else {
                isZoomed = false;
                return false;
            }
        };

        // Function to set the zoomed state from outside the WebView
        function setChartZoomedState(zoomed) {
            isZoomed = zoomed;
        };

        // Function to reset zoom based on the zoomed state
        function resetZoom() {
            // Dynamically access the series and x-axis data from the chart instance
            const seriesData = chart.w.config.series[0].data;

            if (!seriesData || seriesData.length === 0) {
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


        //-------------------WEBVIEW ANDROID-------------------

        // Helper functions to get first and last data points
        function getFirstDataPoint() {
            const series = chart.w.config.series[0].data;
            return series.length > 0 ? series[0] : null;
        }

        function getLastDataPoint() {
            const series = chart.w.config.series[0].data;
            return series.length > 0 ? series[series.length - 1] : null;
        }

        // Get full data range
        function getFullDataRange() {
            const first = getFirstDataPoint();
            const last = getLastDataPoint();

            if (!first || !last) {
                return { min: 0, max: 0 };
            }

            return {
                min: parseDate(first.x),
                max: parseDate(last.x)
            };
        }

        // Parse date strings mm/dd/yyyy hh:mm to timestamps
        function parseDate(dateStr) {
            const parts = dateStr.split(/[/ :]/);
            const month = parseInt(parts[0]) - 1;
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            const hour = parseInt(parts[3]);
            const minute = parseInt(parts[4] || 0);
            return new Date(year, month, day, hour, minute).getTime();
        }

        // Get current x-axis min and max
        function getCurrentXRange() {
            const xaxis = chart.w.globals.minX && chart.w.globals.maxX
                ? { min: chart.w.globals.minX, max: chart.w.globals.maxX }
                : getFullDataRange();
            return xaxis;
        }

        // Zoom functions
        function zoomIn() {
            const currentRange = getCurrentXRange();
            const range = currentRange.max - currentRange.min;
            const newRange = range * 0.7; // Zoom in by 30%
            const center = currentRange.min + range / 2;

            chart.zoomX(
                center - newRange / 2,
                center + newRange / 2
            );
            sendMessageOutside("zoomIn", ignoreMouseMove);

        }

        function zoomOut() {
            const currentRange = getCurrentXRange();
            const range = currentRange.max - currentRange.min;
            const newRange = range * 1.3; // Zoom out by 30%
            const center = currentRange.min + range / 2;

            // Don't zoom out beyond original data range
            const fullRange = getFullDataRange();
            const newMin = Math.max(fullRange.min, center - newRange / 2);
            const newMax = Math.min(fullRange.max, center + newRange / 2);

            chart.zoomX(newMin, newMax);
        }

        function resetZoom() {
            const fullRange = getFullDataRange();
            chart.zoomX(fullRange.min, fullRange.max);
        }

        // Pan functions
        function customPanLeft() {
            const currentRange = getCurrentXRange();
            const range = currentRange.max - currentRange.min;
            const panAmount = range * 0.2; // Pan 20% of current range

            const fullRange = getFullDataRange();
            const newMin = Math.max(fullRange.min, currentRange.min - panAmount);
            const newMax = newMin + range;

            chart.zoomX(newMin, newMax);
        }

        function customPanRight() {
            const currentRange = getCurrentXRange();
            const range = currentRange.max - currentRange.min;
            const panAmount = range * 0.2; // Pan 20% of current range

            const fullRange = getFullDataRange();
            const newMax = Math.min(fullRange.max, currentRange.max + panAmount);
            const newMin = newMax - range;

            chart.zoomX(newMin, newMax);
        }

        //Toggles functions
        function toggleMarkers() {
            sendMessageOutside("startLoader", chart.w.config.markers.size);
            const currentSize = chart.w.config.markers.size;
            const newSize = currentSize === 0 ? 2 : 0;

            chart.updateOptions({
                markers: {
                    size: newSize,
                },

            }, false, true);
            sendMessageOutside("tooltip", currentSize === 0 ? true : false);
            sendMessageOutside("stopLoader");
            // chart.updateSeries(chart.w.config.series);
            updateLocale();
        }

        function toggleModes() {
            if (chart.w.globals.zoomEnabled) {
                // Switch to Pan mode
                chart.w.globals.zoomEnabled = false;
                chart.w.globals.panEnabled = true;
                chart.w.globals.selectionEnabled = false;
            } else if (chart.w.globals.panEnabled) {
                // Switch to Selection mode
                chart.w.globals.zoomEnabled = false;
                chart.w.globals.panEnabled = false;
                chart.w.globals.selectionEnabled = true;
            } else if (chart.w.globals.selectionEnabled) {
                // Switch to Zoom mode
                chart.w.globals.zoomEnabled = true;
                chart.w.globals.panEnabled = false;
                chart.w.globals.selectionEnabled = false;
            } else {
                // Default to Zoom mode if no mode is enabled
                chart.w.globals.zoomEnabled = true;
                chart.w.globals.panEnabled = false;
                chart.w.globals.selectionEnabled = false;
            }
        }

        function toggleZoomAndSelection() {
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

        // Export the chart as a PNG image
        async function exportChart() {
            try {
                const dataURI = await chart.dataURI(); // Get Base64 of chart
                sendMessageOutside("exportChart", dataURI.imgURI); // Send to React Native
            } catch (error) {
                console.error("Error exporting chart:", error);
            }
        }


        //-----------------Chart Updates Functions-------------

        function updateChart(filteredData, updatedOptions, title = "Energy Use") {

            if (filteredData.length === 0) {
                sendMessageOutside("Empty Series");
            }

            chart.updateOptions({
                series: [{ name: title, data: filteredData }],
                ...updatedOptions,
            });

            sendMessageOutside("update Chart", [title, filteredData[0]]);
        }

        function updateChartSeries(filteredData, title = "Energy Use") {
            if (filteredData.length === 0) {
                sendMessageOutside("Empty Series");
            }

            chart.updateSeries([{ name: title, data: filteredData }], true);

            sendMessageOutside("updateChartSeries", title);
        }

        function updateChartOptions(updatedOptions) {

            chart.updateOptions(updatedOptions);

            sendMessageOutside("updateChartOptions");
        }

        function resetChartSeries() {
            chart.resetSeries();
            sendMessageOutside("resetChartSeries");
        }

        function appendChartData(data) {
            chart.appendData(data);
        }

        function updateLocale(newLocale = locale, yAxisTitle = yaxisTitle) {

            locale = newLocale;
            yaxisTitle = yAxisTitle;
            // tooltip min/max
            let yValues = chart.w.config.series[0].data.map((point) => point.y);
            let maxY = Math.max(...yValues);
            let minY = Math.min(...yValues);

            // Find indices of max and min values
            let maxIndex = yValues.indexOf(maxY);
            let minIndex = yValues.indexOf(minY);

            // MIN MAX TOOLTIP TEXT
            let MAX = newLocale === "de" ? "  Maximal" : "  Maximum";
            let MIN = newLocale === "de" ? "  Minimum" : "  Minimum";

            // title based on locale
            let currentSeries = chart.w.config.series;
            currentSeries[0].name = newLocale === "de" ? "Energieverbrauch: " : "Energy Use: ";

            chart.updateOptions({
                tooltip: {
                    y: {
                        formatter: (value) => {
                            const formatter = new Intl.NumberFormat(newLocale === "de" ? "de-DE" : "en-IN", { maximumFractionDigits: 2 });
                            return formatter.format(value) + " " + yAxisTitle;
                        },
                    },
                    x: {
                        show: true,
                        formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
                            const date = new Date(value);
                            const formattedDate = date.toLocaleString(newLocale === "de" ? "de-DE" : "en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            });
                            if (dataPointIndex === maxIndex) return formattedDate + MAX;
                            if (dataPointIndex === minIndex) return formattedDate + MIN;
                            return formattedDate;
                        },
                    },
                },
                title: {
                    show: true,
                },
                xaxis: {
                    show: true,
                    tickAmount: 4,
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
                    tickAmount: 10,
                    title: {
                        text: yAxisTitle,
                    },
                    labels: {
                        show: true,
                        minWidth: 0,
                        maxWidth: 160,
                        formatter: (value) => {
                            const locale = newLocale === "de" ? "de-DE" : "en-IN";
                            return new Intl.NumberFormat(locale, {
                                maximumFractionDigits: 0,
                            }).format(value);
                        },
                    },
                },
                responsive: [],
            });
        }

        function updateFormate(type, locale) {
            let newLocale = locale === "de" ? "de-DE" : "en-EN";
            const formatType = type === activeTab ? "default" : type;
            sendMessageOutside("updateFormate", type, formatType);
            activeTab = type;
            chart.updateOptions({
                xaxis: {
                    labels: {
                        formatter: (value) => {
                            const xAxisData = chart.w.globals.initialSeries[0].data;
                            const index = chart.w.globals.labels.indexOf(value);
                            const date = new Date(value);
                            let formatOptions = {};
                            switch (formatType) {
                                case "Day":
                                    if (index === 0) {
                                        formatOptions = {
                                            day: "2-digit",
                                            month: "short",
                                            year: "2-digit",
                                            // hour: "2-digit",
                                            // minute: "2-digit",
                                            // timeZone: "Europe/Berlin",
                                        };
                                    } else {
                                        formatOptions = {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        };
                                    }
                                    break;
                                case "Week":
                                case "Month":
                                    formatOptions = {
                                        year: "2-digit",
                                        month: "short",
                                        day: "2-digit",
                                    };
                                    break;
                                case "default":
                                default:
                                    formatOptions = {
                                        year: "numeric",
                                        month: "short",
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




        // HighLight Annotation
        function highlightMinAndMax(chartInstance) {
            const seriesData = chartInstance.w.config.series[0].data;

            // Check if seriesData is an array and has valid data
            if (!Array.isArray(seriesData) || seriesData.length === 0 || seriesData.length === 1) {
                //Invalid or empty series data
                return;
            }

            // { x, y } format
            if (seriesData[0].x !== undefined && seriesData[0].y !== undefined) {
                const minPoint = seriesData.reduce(
                    (min, point) => {
                        return point.y < min.y ? point : min;
                    },
                    { x: Infinity, y: Infinity }
                );

                const maxPoint = seriesData.reduce(
                    (max, point) => {
                        return point.y > max.y ? point : max;
                    },
                    { x: -Infinity, y: -Infinity }
                );

                // Add annotations to the chart
                chartInstance.clearAnnotations();
                chartInstance.addPointAnnotation({
                    x: new Date(minPoint.x).getTime(),
                    y: minPoint.y,
                    marker: {
                        size: 3,
                        fillColor: "#e31837",
                        strokeColor: "#ffffff",
                        strokeWidth: 1,
                    },
                    label: {
                        text: "Min",
                        style: {
                            color: "#ff0000",
                            fontSize: "5px",
                        },
                    },
                });

                chartInstance.addPointAnnotation({
                    x: new Date(maxPoint.x).getTime(),
                    y: maxPoint.y,
                    marker: {
                        size: 3,
                        fillColor: "#e31837",
                        strokeColor: "#ffffff",
                        strokeWidth: 1,
                    },
                    label: {
                        text: "Max",
                        style: {
                            color: "#ff0000",
                            fontSize: "5px",
                        },
                    },
                });

                sendMessageOutside("highLightedMaxMin", {
                    minX: minPoint.x,
                    minY: minPoint.y,
                    maxX: maxPoint.x,
                    maxY: maxPoint.y,
                });
            } else {
                console.warn("Invalid data format in series");
            }
        }

        const options = {
            series: [{ name: "", data: [{ x: "01/01/2000 00:45:00", y: 0.6 }] }],
            chart: {
                type: "line",
                height: "95%",
                // background:" url('https://www05.enexion-sys.de/img/dotnetchart/default_large_chart.png') no-repeat center center / 500px 600px",
                stacked: false,
                selection: {
                    enabled: true,
                    type: 'x',
                    fill: {
                        color: '#888',
                        opacity: 0.15
                    },
                    stroke: {
                        width: 1,
                        dashArray: 0,
                        color: '#555',
                        opacity: 0.8
                    },
                    xaxis: {
                        min: undefined,
                        max: undefined
                    },
                    yaxis: {
                        min: undefined,
                        max: undefined
                    }
                },
                zoom: {
                    type: "x",
                    enabled: true,
                    autoScaleYaxis: true,
                    zoomedArea: {
                        opacity: 0.1,
                        strokeColor: "#fff",
                    },
                },
                pan: {
                    enabled: true,
                    type: "xy",
                    threshold: 0,
                },
                offsetX: 0,
                offsetY: 5,
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 1000,
                    animateGradually: {
                        enabled: true,
                        delay: 150,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 1000,
                    },
                    initialAnimation: {
                        enabled: false,
                        speed: 1200,
                    },
                },

                toolbar: {
                    show: isInIframe,
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
                                return locale === "en"
                                    ? '="' + date.getFullYear() + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getDate()) + '",' +
                                    '="' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '"'
                                    : '="' + date.getFullYear() + '.' + pad(date.getMonth() + 1) + '.' + pad(date.getDate()) + '",' +
                                    '="' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '"';
                            },
                            valueFormatter(y) {
                                const formattedY = new Intl.NumberFormat(locale, {
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
                events: {
                    dataURI: function (event, chartContext, config) {
                        sendMessageOutside("dataURI", config.dataURI);

                    },

                    animationEnd: function (chartContext, { xaxis, yaxis }) {
                        sendMessageOutside("animationEnd");
                    },

                    mouseMove: function () {
                        sendMessageOutside("mouseMove");
                    },

                    mouseLeave: function () {
                        sendMessageOutside("mouseLeave");
                    },

                    click: function () {
                        sendMessageOutside("click");
                    },

                    legendClick: function () {
                        sendMessageOutside("legendClick");
                    },

                    markerClick: function () {
                        sendMessageOutside("markerClick");
                    },

                    xAxisLabelClick: function () {
                        sendMessageOutside("xAxisLabelClick");
                    },

                    selection: async function (chartContext, { xaxis, yaxis }) {
                        const chart = chartContext;

                        const currentMin = chart.w.globals.minX;
                        const currentMax = chart.w.globals.maxX;
                        const fullRange = getFullDataRange();

                        // Get selection coordinates
                        const selectedMin = xaxis.min;
                        const selectedMax = xaxis.max;

                        const selectionWidth = selectedMax - selectedMin;

                        // Minimum selection threshold (5% of current view)
                        const minSelectionWidth = (currentMax - currentMin) * 0.05;

                        // Calculate zoom parameters
                        let newMin, newMax;
                        const selectionCenter = (selectedMin + selectedMax) / 2;

                        if (selectionWidth < minSelectionWidth) {
                            // Click behavior - zoom out 50% from click point
                            const zoomOutRange = (currentMax - currentMin) * 1.5;
                            newMin = Math.max(fullRange.min, selectionCenter - zoomOutRange / 2);
                            newMax = Math.min(fullRange.max, selectionCenter + zoomOutRange / 2);
                        } else {
                            // Selection behavior - zoom out 2.5x from selection
                            const zoomOutRange = (selectedMax - selectedMin) * 2.5;
                            newMin = Math.max(fullRange.min, selectionCenter - zoomOutRange / 2);
                            newMax = Math.min(fullRange.max, selectionCenter + zoomOutRange / 2);
                        }

                        // Only zoom if the new range is actually wider than current view
                        const currentRange = currentMax - currentMin;
                        const newRange = newMax - newMin;

                        if (!isInIframe) { await updateLocale(); }
                        if (newRange > currentRange * 1.05) {
                            chart.zoomX(
                                newMin,
                                newMax,
                            );
                        } else {
                            chart.resetSeries();
                        }
                    },

                    dataPointMouseEnter: function () {
                        sendMessageOutside("dataPointMouseEnter");
                    },

                    dataPointMouseLeave: function () {
                        sendMessageOutside("dataPointMouseLeave");
                    },

                    scrolled: function () {
                        sendMessageOutside("scrolled");
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
                            sendMessageOutside("Zoom Prevented", null, "No data points visible");
                            return {
                                xaxis: {
                                    min: chartContext.w.globals.minX,
                                    max: chartContext.w.globals.maxX,
                                },
                                yaxis,
                            };
                        }

                        // Post zoom start event
                        sendMessageOutside("Zoom Start", {
                            min: newMinX,
                            max: newMaxX,
                        });


                        // Allow zooming with validated values
                        return {
                            xaxis: {
                                min: newMinX,
                                max: newMaxX,
                            },
                            yaxis,
                        };
                    },

                    beforeResetZoom: function () {
                        sendMessageOutside("beforeResetZoom");
                    },

                    zoomed: function () {
                        sendMessageOutside("chartZoomed", null, null, true);
                        sendMessageOutside("Zoomed");
                    },

                    beforeMount: function () {
                        sendMessageOutside("beforeMount");
                    },

                    mounted: function (chartContext) {
                        sendMessageOutside("mounted");
                        updateToggleMarker();
                        highlightMinAndMax(chartContext);


                        const chartEl = document.querySelector(".apexcharts-canvas");

                        if (chartEl) {
                            chartEl.addEventListener(
                                "touchstart",
                                () => { }, // Or your handler
                                { passive: true }
                            );
                            chartEl.addEventListener(
                                "touchmove",
                                () => { }, // Or your handler
                                { passive: true }
                            );
                            chartEl.addEventListener(
                                "wheel",
                                () => { }, // Or your handler
                                { passive: true }
                            );
                        }
                    },

                    dataPointSelection: function () {
                        sendMessageOutside("dataPointSelection");
                    },

                    updated: function (chartContext) {
                        sendMessageOutside("Chart updated");
                        highlightMinAndMax(chartContext);
                    },
                },
            },
            stroke: {
                curve: "straight",
                width: 2,
                lineCap: "square",
                colors: undefined,
                dashArray: 0,
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
            grid: {
                show: true,
                borderColor: "#ccc",
                strokeDashArray: 0,
                position: "back",
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            markers: {
                size: 0,
                colors: "#e31837",
                strokeColors: "black",
                strokeWidth: 1,
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
                    sizeOffset: 3,
                },
            },
            xaxis: {
                type: "datetime",
                tickAmount: 4,
                title: {
                    text: "-",
                    style: {
                        fontSize: "12px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                    },
                    offsetX: isInIframe ? 0 : -25,
                    offsetY: 0,
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
                    offsetY: 10,
                    style: {
                        fontSize: isInIframe ? "12px" : "8px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 500,
                        //cssClass: 'apexcharts-xaxis-label',
                    },
                    formatter: (value) => {
                        const date = new Date(value);
                        return date.toLocaleString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                        });
                    },
                },
                axisBorder: {
                    show: isInIframe,
                    color: "#78909C",
                    height: 1,
                    width: "100%",
                    offsetX: 0,
                    offsetY: 0,
                },
                axisTicks: {
                    show: true,
                    borderType: "solid",
                    color: "#e5e5e5",
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
                min: function (min) {
                    return min - (min * 0.1);
                },
                max: function (max) {
                    return max + (max * 0.1);
                },
                forceNiceScale: true,
                tickAmount: 10,
                title: {
                    text: "-",
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: "undefined",
                        fontSize: "12px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 700,
                        cssClass: "apexcharts-yaxis-title",
                    },
                },
                labels: {
                    show: true,
                    minWidth: 0,
                    maxWidth: 160,
                    style: {
                        fontSize: isInIframe ? "12px" : "8px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 500,
                    },
                    offsetX: 0, //y axis labels
                    offsetY: 0,
                    formatter: (value) =>
                        new Intl.NumberFormat("en-EN", {
                            maximumFractionDigits: 0,
                        }).format(value),
                },
                axisBorder: {
                    show: false,
                    color: "#78909C",
                    height: "100%",
                    width: 1,
                    offsetX: -1,
                    offsetY: 0,
                },
                axisTicks: {
                    show: true,
                    borderType: "solid",
                    color: "#e5e5e5",
                    width: 3,
                    offsetX: 0,
                    offsetY: 0,
                },
            },

            annotations: {
                points: [],
            },

            tooltip: {
                enabled: true,
                shared: true,
                intersect: false,
                hideEmptySeries: false,
                fillSeriesColor: false,
                followCursor: false,
                offsetX: 10,
                offsetY: 10,
                style: {
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    background: "#333",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "1px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
                onDatasetHover: {
                    highlightDataSeries: true,
                },
                y: {
                    formatter: (value) =>
                        new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 3,
                        }).format(value) + " kWh",
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
                        });
                    },
                },
                marker: {
                    show: true,
                    radius: 1,
                },
                fixed: {
                    enabled: false,
                    position: "bottomRight", // or 'topLeft', 'bottomRight',topRight etc.
                    offsetX: 0,
                    offsetY: -40,
                },
            },
            fill: {
                colors: ["#e31837"],
                opacity: 1,
                type: 'solid',
            },
            plotOptions: {
                line: {
                    isSlopeChart: false,
                    colors: {
                        threshold: 0,
                        colorAboveThreshold: undefined,
                        colorBelowThreshold: undefined,
                    }
                },
            },
            //this working in portrait and by default in landscape
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: "98%",
                            // background:" url('https://www05.enexion-sys.de/img/dotnetchart/default_large_chart.png') no-repeat center center / 500px 600px",
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

        // Error handling

        // Catch synchronous errors
        window.onerror = function (message, source, lineno, colno, error) {
            const errorDetails = {
                type: 'onerror',
                message,
                source,
                lineno,
                colno,
                stack: error?.stack,
            };

            sendMessageOutside(errorDetails);
        };

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', function (event) {
            const errorDetails = {
                type: 'unhandledrejection',
                reason: event.reason?.message || event.reason,
                stack: event.reason?.stack || null,
            };
            sendMessageOutside(errorDetails);

        });

        //Render Chart
        chart = new ApexCharts(document.querySelector("#chart"), options);
        chart
            .render()
            .then(() => {

                chart.w.globals.isTouchDevice = false;

            })
            .catch((error) => {
                console.error("Chart failed to render:", error);
            });
    </script>
</body>

</html>`;
