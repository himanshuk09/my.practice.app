import React from "react";
import { View, Button, Share } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
const { downloadAsync, documentDirectory } = FileSystem;
const ApexChartWebView = () => {
  // HTML content with ApexCharts integrated
  const chartHTML = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
      </head>
      <body>
        <div id="chart"></div>
        <br />
        <button id="download-png">Download PNG</button>
        <button id="download-svg">Download SVG</button>
        <button id="download-csv">Download CSV</button>

        <script>
          // ApexCharts options and data
          var options = {
            chart: {
              type: 'line',
              height: 350
            },
            series: [{
              name: 'Sales',
              data: [10, 20, 30, 40, 50, 60, 70]
            }],
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
            },
          };

          var chart = new ApexCharts(document.querySelector("#chart"), options);
          chart.render();

          // Button event listeners for download functionality
          document.getElementById('download-png').addEventListener('click', () => {
            chart.download('png');
          });
          document.getElementById('download-svg').addEventListener('click', () => {
            chart.download('svg');
          });
          document.getElementById('download-csv').addEventListener('click', () => {
            chart.download('csv');
          });
        </script>
      </body>
    </html>
  `;
  const onShare = async (url: any) => {
    try {
      return Share.share({
        message: "Choose location to save pdf file",
        url: url,
      });
    } catch (error) {
      return error;
    }
  };
  let downloadDocument = async (downloadUrl: any) => {
    let fileURI = await downloadAsync(
      downloadUrl,
      `${documentDirectory}name.pdf`,
      {}
    );
    await onShare(fileURI.uri);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* {/* <WebView
        originWhitelist={["*"]}
        source={{ html: chartHTML }}
        javaScriptEnabled={true}
        onMessage={(event) => {
          // Log any messages from the WebView
          console.log("Message from WebView: ", event.nativeEvent.data);
        }}
        onFileDownload={(event: any) => {
          console.log("download", event);
          // { nativeEvent: { downloadUrl } }
          // downloadDocument(downloadUrl);
        }}
      /> */}
    </View>
  );
};

export default ApexChartWebView;

// import React, { useEffect } from "react";
// import { View, Text } from "react-native";

// import { i18n } from "@/languageKeys/i18nConfig";
// import { useDispatch } from "react-redux";
// import { inActiveLoading } from "@/store/navigationSlice";
// import { useIsFocused } from "@react-navigation/native";
// const Privacy = () => {
//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();
//   useEffect(() => {
//     setTimeout(() => dispatch(inActiveLoading()), 100);
//   }, [isFocused]);
//   return (
//     <View className="flex-1 justify-center items-center bg-gray-100">
//       {/* <ComingSoon /> */}

//       <Text className="text-4xl font-bold text-gray-700 mb-4">
//         {i18n.t("comingsoon")}
//       </Text>
//       <Text className="text-lg text-center  text-gray-500">
//         {i18n.t("We_re_working_hard_to_bring_you_something_amazing")}
//       </Text>
//     </View>
//   );
// };

// export default Privacy;
