let htmlContent = `
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Simple Apex Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    </head>
    <body>
    <div id="chart" style="height: 350px"></div>
    <script>
        let chart;
        const initialData = [
        { x: new Date("2024-01-01").getTime(), y: 4100 }];
        const locales = {
        en: {
            name: 'en',
            options: {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            toolbar: {
                download: 'Download SVG',
                selection: 'Selection',
                selectionZoom: 'Selection Zoom',
                zoomIn: 'Zoom In',
                zoomOut: 'Zoom Out',
                pan: 'Panning',
                reset: 'Reset Zoom',
            }
            }
        },
        de: {
            name: 'de',
            options: {
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            toolbar: {
                exportToSVG: 'SVG speichern',
                exportToPNG: 'PNG speichern',
                exportToCSV: 'CSV speichern',
                menu: 'Menü',
                selection: 'Auswahl',
                selectionZoom: 'Auswahl vergrößern',
                zoomIn: 'Vergrößern',
                zoomOut: 'Verkleinern',
                pan: 'Verschieben',
                reset: 'Zoom zurücksetzen'
            }
            }
        }
        };
        function renderChart() {
        const options = {
            series: [{ name: "Energy Consumption (kWh)", data: [] }],
            chart: {
            type: "line",
            height: 480,
            background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
            stacked: false,
            locales: [locales.en, locales.de],
            defaultLocale: "de",
            selection: {
                enabled: true,
            },
            zoom: { type: "xy", enabled: true, autoScaleYaxis: true },
            animations: {
                enabled: true,
                easing: "ease-in",
                speed: 1000,
                dynamicAnimation: {
                enabled: true,
                speed: 100,
                },
                animategradually: {
                enabled: false,
                delay: 0
                },
            }, 
            toolbar: {
                show: true,
                offsetX: 5,
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
            // events: {
            //   beforeMount: () => {},
            //   mounted: () => {},
            //   zoomed: () => {},
            //   beforeResetZoom: () => {},
            //   beforeZoom: () => {},
            // },
            events: {
                mounted: () => {
             
                // setTimeout(() => {
                //   window.ReactNativeWebView.postMessage(JSON.stringify({ event: "mounted" }));
                // }, 100); 
                if (window.ReactNativeWebView) {
                    console.log("Sending message to React Native...");
                    window.ReactNativeWebView.postMessage(
                    JSON.stringify({ event: "dataLoaded" })
                    );
                }
                },
            },
            },
            stroke: { curve: "straight", width: 0.7 },
            noData: {
              text: "",
              align: "center",
              verticalAlign: "middle",
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: "#e31837",
                  fontSize: "25px",
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
              row: {
                  colors: ["#e5e5e5", "transparent"],
                  opacity: 0.2,
              },
              column: {
                  colors: ["#f8f8f8", "transparent"],
                  opacity: 0.2,
              },
              xaxis: {
                  lines: {
                  show: true,
                  },
              },
              yaxis: {
                  lines: {
                  show: true,
                  },
              },
              padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 13,
              },
            },
            markers: {
              size: 0,
              colors: "#b81c03",
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
                  sizeOffset: 5,
              },
            },
            xaxis: {
              type: "datetime",
              tickAmount: 5,
              title: {
                  text: "Date / Time",
                  style: {
                  fontSize: "12px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  },
              },
              labels: {
                  show: true,
                  rotate: -45,
                  rotateAlways: true,
                  position: "top",
                  textAnchor: "end",
                  hideOverlappingLabels: true,
                  showDuplicates: false,
                  trim: false,
                  maxHeight: 120,
                  style: {
                      fontSize: "8px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 300,
                  },
                  formatter: (value) => {
                    const date = new Date(value);
                    return date.toLocaleString(locale === 'de' ? 'de-DE' : 'en-IN', {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        timeZone: "Europe/Berlin",
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
            },
            yaxis: {
            labels: {
                show: true,
                minWidth: 0,
                maxWidth: 160,
                style: {
                fontSize: "1px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 200,
                },
                offsetX: 0,
                offsetY: 0,
                formatter: (value) => {
                const formatter = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 0 });
                return formatter.format(value);
                }
            },
            axisBorder: {
                show: true,
                color: "#78909C",
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                show: true,
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
            tooltip: {
                enabled: true,
                shared: true,
                intersect: false,
                onDatasetHover: {
                    highlightDataSeries: true,
                },
            y: {
                formatter: (value) => {
                const formatter = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 3 });
                return formatter.format(value) + "kWh";
                },
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
                  timeZone: "Europe/Berlin",
                  });
              },
              },
            },
            fill: {
                colors: ["#b81c03"],
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.2,
                    opacityTo: 0,
                },
            },
        };

        chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
        }

        function updateChart(filteredData, updatedOptions) {
            chart.updateSeries([{ data: filteredData }]);
            chart.updateOptions(updatedOptions);
        }
        function updateChartSeries(filteredData) {
            chart.updateSeries([{ data: filteredData }])
        }
        function updateChartOptions( updatedOptions) {
            chart.updateOptions(updatedOptions);
        }
        function resetChartSeries(){
            chart.resetSeries();
        }
        function appendChartData(data){
            chart.appendData(data)
        }

        function updateLocale(newLocale) {
        const localeOptions = newLocale === 'de' ? locales.de : locales.en;
        chart.updateOptions({
            chart: {
            defaultLocale: "de",
            locales: [locales.de],
            },
            tooltip: {
            y: {
                formatter: (value) => {
                const formatter = new Intl.NumberFormat(newLocale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 3 });
                return formatter.format(value) + " "+ "kWh";
                }
            },
            x: {
              show: true,
              formatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleString(newLocale === 'de' ? 'de-DE' : 'en-IN', {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Europe/Berlin",
                  });
              },
              },
            },
            xaxis: {
            labels:{
                formatter: (value) => {
                const date = new Date(value);
                return date.toLocaleString(newLocale === 'de' ? 'de-DE' : 'en-IN', {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    timeZone: "Europe/Berlin",
                });
                },
            },
            },
            yaxis: {
            labels: {
                show: true,
                minWidth: 0,
                maxWidth: 160,
                style: {
                fontSize: "8px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 300,
                },
                offsetX: 0,
                offsetY: 0,
                formatter: (value) => {
                const formatter = new Intl.NumberFormat(newLocale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 0 });
                return formatter.format(value);
                }
            },
            axisBorder: {
                show: true,
                color: "#78909C",
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                show: true,
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
        }
    
        document.addEventListener("DOMContentLoaded", () => {
        renderChart();
        });
    
    
    </script>
    </body>
</html>
`;
let iframehtmlcontent = `
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
        const locales = {
            en: {
            name: 'en',
            options: {
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                toolbar: {
                download: 'Download SVG',
                selection: 'Selection',
                selectionZoom: 'Selection Zoom',
                zoomIn: 'Zoom In',
                zoomOut: 'Zoom Out',
                pan: 'Panning',
                reset: 'Reset Zoom',
                }
            }
            },
            de: {
            name: 'de',
            options: {
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                toolbar: {
                exportToSVG: 'SVG speichern',
                exportToPNG: 'PNG speichern',
                exportToCSV: 'CSV speichern',
                menu: 'Menü',
                selection: 'Auswahl',
                selectionZoom: 'Auswahl vergrößern',
                zoomIn: 'Vergrößern',
                zoomOut: 'Verkleinern',
                pan: 'Verschieben',
                reset: 'Zoom zurücksetzen'
                }
            }
            }
        };
            var options = {
            series: [{ name: "Energy Consumption (kWh)", data: [] }],
            chart: {
                height: 700,
                type: "line",
                 background: "url('https://i.ibb.co/ryQkmKq/new.png') no-repeat center center",
                backgroundSize: "cover",
                stacked: false,
                locales: [locales.en, locales.de],
                defaultLocale: "en",
                zoom: { type: "x", enabled: true, autoScaleYaxis: true },
                animations: {
                enabled: true,
                easing: "linear",
                speed: 1000,
                dynamicAnimation: {
                    enabled: true,
                    speed: 100,
                },
                animategradually: {
                    enabled: false,
                    delay: 0
                },
                },  
                selection: {
                enabled: true,
                },        
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
            dataLabels: {
                enabled: false
            },
            stroke: { curve: "straight", width: 1 },
            noData: {
                text: "",
                align: "center",
                verticalAlign: "middle",
                offsetX: 0,
                offsetY: 0,
                style: {
                color: "#e31837",
                fontSize: "25px",
                fontFamily: "Helvetica, Arial, sans-serif",
                },
            },
            grid: {
                show: true,
                borderColor: "#ccc",
                strokeDashArray: 0,
                position: "back",
                row: {
                colors: ["#e5e5e5", "transparent"],
                opacity: 0.2,
                },
                column: {
                colors: ["#f8f8f8", "transparent"],
                opacity: 0.2,
                },
                xaxis: {
                lines: {
                    show: true,
                },
                },
                yaxis: {
                lines: {
                    show: true,
                },
                },
                padding: {
                top: 0,
                right: 15,
                bottom: 0,
                left: 15,
                },
            },
            markers: {
                size: 0,
                colors: "#b81c03",
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
                sizeOffset: 5,
                },
            },
            fill: {
                colors: ["#b81c03"],
                gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.2,
                opacityTo: 0,
                },
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: "Date / Time",
                    style: {
                        fontSize: "12px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                    },
                },
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: true,
                    position: "top",
                    textAnchor: "end",
                    hideOverlappingLabels: true,
                    showDuplicates: false,
                    trim: false,
                    maxHeight: 120,
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
                        timeZone: "Europe/Berlin",
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
            },
            yaxis: {
                title: {
                text: "unit",
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
                show: true,
                color: "#78909C",
                offsetX: 0,
                offsetY: 0,
                },
                axisTicks: {
                show: true,
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
                    timeZone: "Europe/Berlin",
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
                breakpoint: 1000,
                options: {
                  chart:{
                    height:550,
                    background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
                  }
                  
                }
              }
            ]
            };
            window.parent.postMessage("iframeReady", "*");
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();

            window.updateChart = function(filteredData,updatedOptions) {    
                chart.updateSeries(filteredData);
                chart.updateOptions(updatedOptions);
            };

            window.updateChartSeries = function(filteredData) {    
                chart.updateSeries(filteredData);
            };

            window.updateChartOptions = function(updatedOptions) {
            chart.updateOptions(updatedOptions);
            };
           
            window.updateLocale=(newLocale)=>{
                const localeOptions = newLocale === 'de' ? locales.de : locales.en;
                chart.updateOptions({
                    chart: {
                    defaultLocale: newLocale,
                    locales: [locales.de],
                    },
                    tooltip: {
                      y: {
                          formatter: (value) => {
                          const formatter = new Intl.NumberFormat(newLocale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 3 });
                          return formatter.format(value) + " "+ "kWh";
                          }
                      },
                      x: {
                        show: true,
                        formatter: (value) => {
                            const date = new Date(value);
                            return date.toLocaleString(newLocale === 'de' ? 'de-DE' : 'en-IN', {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "Europe/Berlin",
                            });
                        },
                        },
                      },
                    xaxis: {
                    labels:{
                        formatter: (value) => {
                        const date = new Date(value);
                        return date.toLocaleString(newLocale === 'de' ? 'de-DE' : 'en-IN', {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            timeZone: "Europe/Berlin",
                        });
                        },
                    },
                    },
                    yaxis: {
                    labels: {
                        show: true,
                        formatter: (value) => {
                            const locale = newLocale === 'de' ? 'de-DE' : 'en-IN';
                            return value.toLocaleString(locale, { maximumFractionDigits:0});
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: "#78909C",
                        offsetX: 0,
                        offsetY: 0,
                    },
                    axisTicks: {
                        show: true,
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
                })}
        </script>
        </body>
        </html>
        `;
