import WebViewComponent from "@/components/WebViewComponent";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";

import { useDispatch } from "react-redux";

const Portfolio_OverView = () => {
  const [iframeReady, setIframeReady] = useState(false);
  const donutChartRef = useRef<any>(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const donutChartHtmlIframe = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0/>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  </head>
  <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh;">
    <div id="donut-chart" style="width:100%; height:100%;"></div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        var options = {
          series: [30,70],
          labels: ["Open", "Closed"],
          chart: {
            type: 'donut',
            height: '95%',
            background: "none",
            animations: { enabled: true },
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              autoSelected: "zoom",
              tools: {
                download: true,
                reset: true,
                zoomin: true,
                zoomout: true,
                zoom: false,
                pan: false,
                selection: false,
              },
            },
          },
          tooltip: {
            show: true,
            theme: "dark",
            style: {
              fontSize: "12px", 
              fontFamily: "Arial, sans-serif", 
              color: "#ffffff", 
            },
            y: {
              formatter: (val) => {
                return val + "%";  
              },
              title: {
                  formatter: (val)=> val + " :" 
              },
            },
          },
          colors: ["#e31837", "#7f7f7f"],
          plotOptions: {
            pie: {
              donut: {
                 background: "none",
                // background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
                labels: {
                  show: true,
                  name: {
                    show: false,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#263238",
                    offsetY: 0,
                  },
                  value: {
                    show: true,
                    fontSize: "16px",
                    fontWeight: "bold",
                    color:[ "#e31837"],
                    offsetY: 0,
                    formatter: function (val) {
                      return val +"%";
                    },
                  },
                  total: {
                    show: false,
                    showAlways: false,
                    label: "Total",
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce(
                        (a, b) => a + b,
                        0
                      ); 
                    },
                  },
                },

              }
            }
          },
          
          dataLabels: { enabled: false },
          fill: { type: 'gradient' },
          legend: {
            show: true,
            position: 'bottom'
          },
          title: {
            text: "Strom 2024",
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              color: "#94a3b8",
            },
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: { width: '100%' , background: "transparent",},
              legend: { position: 'bottom' }
            }
          }]
        };

        var donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
        donutchart.render();

        //...........
        // Expose updateChartSeries globally
        window.updateChartSeries = function(filteredData) {
          
          if (Array.isArray(filteredData) && filteredData.every(val => typeof val === 'number')) {
            donutchart.updateSeries(filteredData);
          } else {
            console.error("Invalid data format for chart series.");
          }
        };

        window.updateChartOptions = function(updatedOptions) {
          donutchart.updateOptions(updatedOptions);
        };

      
        window.parent.postMessage("iframeReady", "*");

        //....for webview

        function updateChartSeries(filteredData) {
          chart.updateSeries([{ data: filteredData }])
        }
        function updateChartOptions( updatedOptions) {
          chart.updateOptions(updatedOptions);
        }
      });
    </script>
  </body>
  </html>
`;
  const areaChartHtmlIframe = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0/>
      <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    </head>
    <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh;">
      <div id="chart" style="width:100%; height:100%;"></div>
      <script>
        var options = {
          series: [{
            name: 'Open',
            data: [31, 40, 28, 51, 42, 109, 100]
          }, {
            name: 'Closed',
            data: [11, 32, 45, 32, 34, 52, 41]
          }],
          colors: ["#ff0000", "#808080"],
          
          chart: {
            height: 305,
            type: "area",
            zoom: {
              enabled: true,
            },
            background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                selection: true,
                zoom: false,
                zoomin: true,
                zoomout: true,
                pan: false,
              },
            },
          },
          title: {
            text: "Target 2024",
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              color: "#94a3b8",
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: [
              "2018-09-19T00:00:00.000Z",
              "2018-09-19T01:30:00.000Z",
              "2018-09-19T02:30:00.000Z",
              "2018-09-19T03:30:00.000Z",
              "2018-09-19T04:30:00.000Z",
              "2018-09-19T05:30:00.000Z",
              "2018-09-19T06:30:00.000Z"
            ]
          },
          yaxis: {
            title: {
              text: "MWh",
            },
          },
          legend: {
            show: true,
            position: "bottom",
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      </script>
    </body>
    </html>
  `;

  const updateChartOptionsIframe = (updatedOptions: any) => {
    const iframe = donutChartRef.current;
    if (iframe && iframe.contentWindow) {
      if (iframe.contentWindow.updateChartOptions) {
        iframe.contentWindow.updateChartOptions(updatedOptions);
      } else {
        console.error(
          "updateChartOptions function is not accessible in the iframe."
        );
      }
    } else {
      console.error("Iframe contentWindow is not accessible.");
    }
  };
  const updateChartSeriesIframe = (filteredData: any) => {
    const iframe = donutChartRef.current;
    if (iframe && iframe.contentWindow) {
      if (iframe.contentWindow.updateChartSeries) {
        iframe.contentWindow.updateChartSeries(filteredData);
      } else {
        console.error(
          "updateChartSeries function is not accessible in the iframe."
        );
      }
    } else {
      console.error("Iframe contentWindow is not accessible.");
    }
  };
  const updateChartOptionsWebView = (updatedOptions: any) => {
    if (donutChartRef.current) {
      donutChartRef.current.injectJavaScript(
        `if (typeof updateChartOptions === 'function') { updateChartOptions(${JSON.stringify(
          updatedOptions
        )}); } else { console.error('updateChartOptions function is not accessible in the WebView.'); }`
      );
    } else {
      console.error("WebView is not accessible.");
    }
  };
  const updateChartSeriesWebView = (filteredData: any) => {
    if (donutChartRef.current) {
      donutChartRef.current.injectJavaScript(
        `if (typeof updateChartSeries === 'function') { 
            updateChartSeries(${JSON.stringify(filteredData)});
          } else { 
            console.error('updateChartSeries function is not accessible in the WebView.');
          }`
      );
    } else {
      console.error("WebView is not accessible.");
    }
  };
  // Function to update chart data
  const viewDetails = () => {
    const filteredData = [40, 50];
    const newOptions = {
      colors: ["#4CAF50", "#FFC107"],
    };
    if (Platform.OS === "web") {
      updateChartOptionsIframe(newOptions);
      updateChartSeriesIframe(filteredData);
    } else {
      updateChartOptionsWebView(newOptions);
      updateChartSeriesWebView(filteredData);
    }
  };
  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log("Iframe loaded, ready to interact.");
  };
  useEffect(() => {
    const messageHandler = (event: any) => {
      if (event.data === "iframeReady") {
        setIframeReady(true);
      }
    };

    return () => {};
  }, []);

  // for webview
  const updateChart = () => {
    const filteredData = [40, 50]; // The new data you want to inject into the chart
    const newOptions = {
      colors: ["#4CAF50", "#FFC107"], // Example of changing colors
    };
    (donutChartRef.current as any)?.injectJavaScript(
      `updateChartSeries(${JSON.stringify(filteredData)});`
    );
    donutChartRef.current?.injectJavaScript(
      `updateChartOptions(${JSON.stringify(newOptions)});`
    );
  };

  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView
      className="flex-1 "
      // style={{
      //   paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      // }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View className="flex-1 bg-white p-4">
        <View className="flex flex-row justify-between h-[30%] mb-2">
          <View className="w-[50%] h-[100%]">
            <WebViewComponent
              htmlcontentIframe={donutChartHtmlIframe}
              refVar={donutChartRef}
              onLoad={handleIframeLoad}
            />
          </View>
          <View className="w-[40%] flex flex-col justify-start m-1">
            <View className="mb-2">
              <Text className="text-rose-600 font-bold">Closed</Text>
              {["770,005 $", "17,588 MWh", "43.83 $/MWh"].map((item, index) => (
                <Text
                  key={index}
                  className="text-md font-medium text-slate-400 ml-2"
                >
                  {item}
                </Text>
              ))}
            </View>
            <View>
              <Text className="text-slate-400 font-bold">Open</Text>
              {["2,829,207 $", "57,288 MWh", "49.39 $/MWh"].map(
                (item, index) => (
                  <Text
                    key={index}
                    className="text-md font-medium text-slate-400 ml-2"
                  >
                    {item}
                  </Text>
                )
              )}
            </View>
          </View>
        </View>
        <View className="h-1 bg-slate-300 my-2" />
        <View className="h-[55%]">
          <WebViewComponent htmlcontentIframe={areaChartHtmlIframe} />
        </View>
        <TouchableOpacity
          className="h-10 items-center bg-[#e31837] m-3 justify-center"
          onPress={viewDetails}
        >
          <Text className="text-white font-bold">VIEW DETAILS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Portfolio_OverView;
