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
            height: '100%',
            background: "none",
            animations: { enabled: true },
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              autoSelected: "zoom",
              tools: {
                download: false,
                reset: false,
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
                    // fontSize: "18px",
                    // fontWeight: "bold",
                    // color: "#dbe2e5a8",
                    // offsetY: 0,
                  },
                  value: {
                    show: true,
                    fontSize: "16px",
                    fontWeight: "bold",
                    color:[ "#e31837"],
                    offsetY: 2,
                    offsetX:10,
                    formatter: function (val) {
                      return val +"\t%";
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
          // fill: { type: 'gradient' },
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
          }],
          
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
          series: [
            {
              name: 'Forward',
              data: [10, 25, 15, 30, 20, 35, 25, 40, 20, 15, 10, 30],
            },
            {
              name: 'IbISwing',
              data: [15, 20, 10, 35, 25, 30, 20, 25, 15, 20, 25, 15],
            },
            {
              name: 'IbIspot',
              data: [20, 10, 30, 25, 35, 20, 10, 15, 30, 25, 35, 20],
            },
            {
              name: 'Closed',
              data: [5, 10, 7, 12, 8, 15, 10, 8, 12, 5, 7, 10],
            },
          ],
          colors: ["#cecece", "#e4e4e4","#b5b5b5","#c32442"],
          chart: {
              height: 360,
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
            type: "category",
          categories: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"
          ]
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
              width: 40, // Makes the marker wide like a line
              height: 1, // Reduces the height to appear as a thin line
              radius: 0, // No rounded corners, to maintain a line shape
              offsetX: -5, // Adjust the position slightly
            },
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
  const closedData = [
    { value: "770,005", unit: "$" },
    { value: "17,588", unit: "MWh" },
    { value: "43.83", unit: "$/MWh" },
  ];
  const openData = [
    { value: "2,829,207", unit: "$" },
    { value: "57,288", unit: "MWh" },
    { value: "49.39", unit: "$/MWh" },
  ];
  const InfoItem = ({
    value,
    unit,
    width,
  }: {
    value: string;
    unit: string;
    width: string;
  }) => (
    <View className={`flex-row justify-between ${width}`}>
      <Text className="text-md font-medium text-slate-400 ml-2">{value}</Text>
      <Text className="text-md font-medium text-slate-400">{unit}</Text>
    </View>
  );
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView className="flex-1 ">
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
            <View className="mb-2 ">
              <Text className="text-rose-600 font-bold">Closed</Text>
              {/* {["770,005 $", "17,588 MWh", "43.83 $/MWh"].map((item, index) => (
                <Text
                  key={index}
                  className="text-md font-medium text-slate-400 ml-2"
                >
                  {item}
                </Text>
              ))} */}
              {closedData.map((item, index) => (
                <InfoItem
                  key={index}
                  value={item.value}
                  unit={item.unit}
                  width={["w-24", "w-32", "w-36"][index]}
                />
              ))}
            </View>
            <View>
              <Text className="text-slate-400 font-bold">Open</Text>

              {openData.map((item, index) => (
                <InfoItem
                  key={index}
                  value={item.value}
                  unit={item.unit}
                  width={["w-24", "w-32", "w-36"][index]}
                />
              ))}
            </View>
          </View>
        </View>
        <View className="h-1 bg-slate-300 my-2" />
        <View className="h-[60%]">
          <WebViewComponent htmlcontentIframe={areaChartHtmlIframe} />
        </View>
        <TouchableOpacity
          className="h-12 items-center bg-[#e31837] m-1 justify-center"
          onPress={viewDetails}
        >
          <Text className="text-white font-bold">VIEW DETAILS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Portfolio_OverView;
