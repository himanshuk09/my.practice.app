export const donutchartcombine = /*html */ `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
    <title>Donut Chart with ApexCharts for Webview</title>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <style>
        #donut-chart {
            width: 100%;
            height: 100%;
            touch-action: none;
            overflow: hidden;
        }
    </style>
</head>

<body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div id="donut-chart"></div>
    <script>

        var activeIndex = null;
        let donutchart;


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

        function resetChartSeries() {
            donutchart.resetSeries();
            sendMessageOutside("resetChartSeries");
        }

        function appendChartData(data) {
            donutchart.appendData(data);
        }

        //Expose updateChartSeries
        function updateChartSeries(filteredData) {
            donutchart.updateSeries(filteredData, true);
            sendMessageOutside("updateChartSeries");
        };

        function updateChartOptions(updatedOptions) {
            donutchart.updateOptions(updatedOptions);
            sendMessageOutside("updateChartOptions");
        };

        function updateChart(filteredData, updatedOptions) {
            donutchart.updateOptions(updatedOptions);
            donutchart.updateSeries(filteredData, true);
            sendMessageOutside("uupdateChart", filteredData);
        };

        function updateLocale(locale) {
            sendMessageOutside("locale");
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


        let options = {
            series: [1, 1],
            labels: ["Open", "Closed"],
            chart: {
                type: "donut",
                height: "95%",
                width: "100%",
                background: "none",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800, //  Reduced for smoother transition
                    animateGradually: {
                        enabled: true,
                        delay: 800, //  Lowered for faster animation
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 800, //  Smoother animation
                    },
                },
                toolbar: { show: false },
                events: {
                    dataPointSelection: function (event, chartContext, config) {
                        let clickedIndex = config.dataPointIndex;
                        if (clickedIndex === -1 || clickedIndex === undefined) return;
                        if (activeIndex === clickedIndex) {
                            activeIndex = null;
                            donutchart.updateOptions(
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
                                true,
                                true
                            );
                            donutchart.updateSeries(donutchart.w.config.series);
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
                            true,
                            true
                        );
                        donutchart.updateSeries(donutchart.w.config.series);

                    },
                    animationEnd: function (chartContext, { xaxis, yaxis }) {
                        sendMessageOutside("animationEnd donut");
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

                    updated: function (chartContext) {
                        sendMessageOutside("Pie Chart updated");
                    
                    },
                },
            },
            noData: {
                text: "",
                align: "center",
                verticalAlign: "middle",
                offsetX: 0,
                offsetY: -10,
                style: {
                    color: "#7f7f7f",
                    fontSize: "20px",
                    fontWeight: "600",
                    fontFamily: "Helvetica, Arial, sans-serif",
                },
            },
            colors: ["#7f7f7f", "#e31837"],
            plotOptions: {
                pie: {
                    startAngle: 0,
                    endAngle: 360,
                    expandOnClick: false,
                    offsetX: 0,
                    offsetY: 0,
                    customScale: 1.1,
                    dataLabels: {
                        offset: 5,
                        minAngleToShowLabel: 10,
                    },
                    donut: {
                        size: "65%",
                        background: "transparent",
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                showAlways: true,
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
                                showAlways: true,
                                fontSize: "15px",
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontWeight: 500,
                                color: undefined,
                                offsetY: -5,
                                offsetX: -5,
                                formatter: function (val) {
                                    return new Intl.NumberFormat("en-EN", {
                                        style: "percent",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }).format(val / 100);
                                },
                            },
                            total: {
                                show: false,
                                showAlways: false,
                                label: "Total",
                                fontSize: "15px",
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontWeight: 500,
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + "%";
                                },
                            },
                        },
                    },
                },
            },
            tooltip: {
                enabled: false,
            },
            dataLabels: { enabled: false },
            legend: {
                show: false,
            },
            fill: {
                type: "gradient",
            },
            title: {
                text: "-",
                align: "center",
                style: {
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#7f7f7f",
                },
            },
            stroke: {
                show: true,
                width: 1,
                colors: ["transparent"],
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: { width: "100%" },
                    },
                },
            ],
        };


        donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
        donutchart.render();
    </script>
</body>

</html>`;
