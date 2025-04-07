const webviewDonutChartHtmlContent = `
<!DOCTYPE html>
<html lang="en">
      <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
            <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
            <style>
                  #donut-chart {
                        width: 100%;
                        height: 100%;
                        touch-action: none;
                  }
            </style>
      </head>
      <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div id="donut-chart"></div>
            <script>

            function sendMsgToReactNative (action,values=null){
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                        action: action,
                        values: values,
                  }))
            } 
                  let  activeIndex = null;
                  let options = {
                        series: [0, 0],
                        labels: ["Open", "Closed"],
                        chart: {
                              type: "donut",
                              height: "100%",
                              width: "100%",
                              background: "none",
                              animations: {
                                    enabled: true,
                                    easing: "easeinout",
                                    speed: 1000, // ✅ Reduced for smoother transition
                                    animateGradually: {
                                      enabled: true,
                                      delay: 1000, // ✅ Lowered for faster animation
                                    },
                                    dynamicAnimation: {
                                      enabled: true,
                                      speed: 1500, // ✅ Smoother animation
                                    },
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
                                                              style: 'percent',
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
                              text: ".",
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

                  

                  //...........

                  function resetChartSeries() {
                        donutchart.resetSeries();
                        sendMsgToReactNative ("resetChartSeries");
                  }

                  function appendChartData(data) {
                        donutchart.appendData(data);
                  }

                  //Expose updateChartSeries globally
                  window.updateChartSeries = function (filteredData) {
                        donutchart.updateSeries(filteredData, true);
                        sendMsgToReactNative ("updateChartSeries");
                  };

                  window.updateChartOptions = function (updatedOptions) {
                        donutchart.updateOptions(updatedOptions);
                  };

                  window.updateChart = function (filteredData, updatedOptions) {
                        // donutchart.updateOptions(updatedOptions);
                        // donutchart.updateSeries(filteredData, true);
                        sendMsgToReactNative ("updateChart updated");
                        donutchart.updateOptions({
                              series: filteredData,
                              animations: {
                                enabled: true,
                                speed: 800
                              },...updatedOptions
                            }, true, true);
                     
                  };
                  function updateLocale(locale) {
                        sendMsgToReactNative ("updateChart locale");
                        donutchart.updateOptions({
                          plotOptions: {
                            pie: {
                              donut: {
                                labels: {
                                  value: {
                                    formatter: function(val) {
                                      // Handle cases where val might be undefined/null
                                      if (val === null || val === undefined) return '0%';
                                      
                                      return new Intl.NumberFormat(locale, {
                                        style: 'percent',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2
                                      }).format(val / 100);
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }, true, true); // (newOptions, redraw, animate)
                  }

                  var donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
                  donutchart.render();

            </script>
      </body>
</html>

`;

export default webviewDonutChartHtmlContent;
