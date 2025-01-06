export let WebviewLineHtmlContent = `   <!DOCTYPE html>
    <html lang="en">
    <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
            <title>Simple Apex Chart</title>
            <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
            <style>
               
                #chart {
                    width: 100%;
                    touch-action: none;
                }
                .apexcharts-element-hidden {
                    opacity: 1 !important; 
                    visibility: visible !important; 
                  }
            </style>
    </head>
    <body>
            
            <div id="chart"></div>
           
            <script>
                let chart;
                const locales = {
                    en: {
                        name: 'en',
                        options: {
                            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                            shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            toolbar: {
                                exportToSVG: 'Download SVG',
                                exportToPNG: 'Download PNG',
                                exportToCSV: 'Download CSV',
                                menu: 'Menü',
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
                
                function toggleMarkers() {
                    // Start loader
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'startLoader' }));
                    const currentSize = chart.w.config.markers.size;
                    const newSize = currentSize === 0 ? 2 : 0;
                    // Update chart options
                    chart.updateOptions({
                        markers: {
                            size: newSize
                        },
                        chart: {
                            toolbar: {
                                tools: {
                                    customIcons: [
                                        {
                                            icon: newSize === 0
                                                ? '<span class="apexcharts-custom-icon" >🔘</span>'
                                                : '<span class="apexcharts-custom-icon">🔴</span>',
                                            title: 'Toggle Markers',
                                            index: -2,
                                            class: 'custom-icon-class custom-icon',
                                            click: toggleMarkers // Reassign to the same function
                                        },
                                        {
                                            icon: '<span class="apexcharts-custom-icon">💾</span>',
                                            index: -1,
                                            title: 'Download Chart',
                                            class: 'custom-download-icon',
                                            click: exportChart,
                                        }, 
                                    ]
                                }
                            }
                        }
                    });
                    // Stop loader after chart update
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'stopLoader' }));
                }

                function renderChart() {
                    const options = {
                        series: [{ name: "Energy Use", data: []}],
                        chart: {
                            type: "line",
                            height: 270,
                            // background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
                            background:"white",
                            stacked: false,
                            locales: [locales.en, locales.de],
                            defaultLocale: "en",
                            selection: { enabled: true },
                            zoom: { 
                                type: "x", enabled: true, 
                                autoScaleYaxis: true,
                                zoomedArea: {
                                    opacity: 0.2,      // Optional: change opacity of the zoomed area
                                    strokeColor: '#fff', // Optional: change stroke color of zoom area
                                },
                            },
                            pan: {
                                enabled: true,
                                type: 'xy', // Allows both vertical and horizontal panning
                                threshold: 1 // Set threshold to control the panning speed
                              },
                            offsetX: -2,
                            offsetY: 30,
                            animations: {
                                enabled: false,
                                easing: "ease-in",
                                speed: 500,
                                dynamicAnimation: { enabled: true, speed: 1000 },
                                animategradually: { enabled: true, delay: 2000 },
                                initialAnimation: {enabled: false}
                            },
                            // animations: {
                            //     enabled: true,
                            //     easing: "ease-in",
                            //     speed: 1000,
                            //     dynamicAnimation: { enabled: true, speed: 100 },
                            //     animategradually: { enabled: false, delay: 0 }
                            // },
                            toolbar: {
                                show: false,
                                offsetX:-5,
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
                                    customIcons:[
                                        {
                                            icon: '<span class="apexcharts-custom-icon">🔘</span>',
                                            title: 'Toggle Markers',
                                            index: -2,
                                            class: 'custom-icon-class custom-icon',
                                            click: toggleMarkers
                                        },
                                        {
                                            icon: '<span class="apexcharts-custom-icon">💾</span>',
                                            index: -1,
                                            title: 'Download Chart',
                                            class: 'custom-download-icon',
                                            click: exportChart,
                                        },
                                       
                                    ],
                                },
                                export: {
                                    csv: true,  
                                    png: true, 
                                    svg: true   
                                }
                            },
                            events: {
                                dataURI: function (event, chartContext, config) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                        type: 'dataURI',
                                        dataURI: config.dataURI
                                    }));
                                },
                                animationEnd: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'animationEnd' })
                                    );
                                },
                                mouseMove: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'mouseMove' })
                                    );
                                },
                                mouseLeave: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'mouseLeave' })
                                    );
                                },
                                click: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'click' })
                                    );
                                },
                                legendClick: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'legendClick' })
                                    );
                                },
                                markerClick: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'markerClick' })
                                    );
                                },
                                xAxisLabelClick: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'xAxisLabelClick' })
                                    );
                                },
                                selection: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'selection',values:[xaxis,yaxis] })
                                    );
                                    const currentMin = chart.w.globals.minX;
                                    const currentMax = chart.w.globals.maxX;
                                    const zoomAmount = (currentMax - currentMin) * 0.1;
                                    chart.updateOptions({
                                        xaxis: {
                                            min: currentMin - zoomAmount,
                                            max: currentMax + zoomAmount,
                                        },
                                    });
                                    
                                },
                                dataPointMouseEnter: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'dataPointMouseEnter' })
                                    );
                                },
                                dataPointMouseLeave: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'dataPointMouseLeave' })
                                    );
                                },
                                scrolled: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'scrolled' })
                                    );
                                },
                                beforeZoom: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'Zoom Start' }));
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'beforeZoom' })
                                    );
                                    // const zoomPercentage = 30; // Desired zoom percentage
                                    // const range = xaxis.max - xaxis.min;

                                    // const seriesData = chartContext.w.config.series[0].data;
                                    // const minX = Math.min(...seriesData.map(point => Array.isArray(point) ? point[0] : point.x));
                                    // const maxX = Math.max(...seriesData.map(point => Array.isArray(point) ? point[0] : point.x));

                                    // const zoomRange = (maxX - minX) * (zoomPercentage / 100);

                                    // return {
                                    // xaxis: {
                                    //     min: xaxis.min,
                                    //     max: xaxis.min + zoomRange,
                                    // },
                                    // };
                                    const zoomPercentage = 30; // Desired zoom percentage
                                    const seriesData = chartContext.w.config.series[0].data;

                                    // Calculate the original data range
                                    const minX = Math.min(...seriesData.map(point => Array.isArray(point) ? point[0] : point.x));
                                    const maxX = Math.max(...seriesData.map(point => Array.isArray(point) ? point[0] : point.x));

                                    // Current visible range
                                    const currentMin = xaxis.min;
                                    const currentMax = xaxis.max;
                                    const currentRange = currentMax - currentMin;

                                    // Increase the range by zoomPercentage for zoom-out
                                    const zoomOutRange = currentRange * (1 + zoomPercentage / 100);

                                    // Adjust new range ensuring it doesn't exceed original bounds
                                    const newMin = Math.max(minX, currentMin - (zoomOutRange - currentRange) / 2);
                                    const newMax = Math.min(maxX, currentMax + (zoomOutRange - currentRange) / 2);

                                    return {
                                        xaxis: {
                                            min: newMin,
                                            max: newMax,
                                        },
                                    };
                                },
                                beforeResetZoom: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'beforeResetZoom' })
                                    );
                                },
                                zoomed: function(chartContext, { xaxis, yaxis }) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'chartZoomed', isZoomed: true })
                                    );
                                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'Zoomed' }));
                                },
                                beforeMount: function (chartContext) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'beforeMount' })
                                    );
                                },
                                mounted: function (chartContext) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'mounted' })
                                    );
                                    highlightMinAndMax(chartContext);
                                },
                                dataPointSelection: function (event, chartContext, config) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'dataPointSelection' })
                                    );
                                },
                                updated: function (chartContext) {
                                    window.ReactNativeWebView.postMessage(
                                        JSON.stringify({ action: 'Chart updated',values:[{
                                            "zoomEnabled": chart.w.globals. zoomEnabled ,"panEnabled":
                                             chart.w.globals.panEnabled,"selectionEnabled":
                                             chart.w.globals.selectionEnabled
                                        }]})
                                    );
                                    highlightMinAndMax(chartContext);
                                },
                            }
                        },
                        
                        stroke: 
                            { 
                                curve: "monotoneCubic", 
                                width: 1.5 //['straight', 'smooth', 'monotoneCubic', 'stepline']
                            },
                        noData: {
                            text: "",
                            align: "center",
                            verticalAlign: "middle",
                            offsetX: 0,
                            offsetY: -50,
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
                                top: -25,
                                right:0,
                                bottom: -5,
                                left:0,
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
                                rotate: 0,
                                rotateAlways: false,
                                position: "top",
                                textAnchor: "end",
                                hideOverlappingLabels: true,
                                showDuplicates: false,
                                trim: false,
                                maxHeight: 120,
                                style: 
                                {
                                    fontSize: "8px",
                                    fontFamily: "Helvetica, Arial, sans-serif",
                                    fontWeight: 300,
                                },
                                formatter: (value) => {
                                    const date = new Date(value);
                                    return date.toLocaleString("en-IN", {
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
                            title: { text: "kWh" },
                            labels: {
                                show: true,
                                minWidth: 0,
                                maxWidth: 160,
                                style: {
                                    fontSize: "8px",
                                    fontFamily: "Helvetica, Arial, sans-serif",
                                    fontWeight: 300,
                                },
                                offsetX: -4,
                                offsetY: 0,
                                formatter: (value) => new Intl.NumberFormat("en-EN", { maximumFractionDigits: 0 }).format(value),
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
                        annotations: {
                            points: []
                        },
                        tooltip: {
                            enabled: true,
                            shared: true,
                            intersect: false,
                            onDatasetHover: {
                                highlightDataSeries: true,
                            },
                            y: { 
                                formatter: (value) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(value) + " kWh" 
                            },
                            x: { 
                                show: true ,
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
                            //#e31837
                            colors: ["#e31837"],
                            gradient: {
                                shadeIntensity: 1,
                                inverseColors: false,
                                opacityFrom: 0.5,
                                opacityTo: 0.9,
                            },
                        },
                        //this working in portrait and by default in landscape 
                        responsive: [{
                            breakpoint: 480,
                            options: {
                            chart: { 
                                width: '100%' , 
                                height:400,
                                // background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center",
                                background:"white",
                            }, 
                            xaxis: 
                                {   
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
                                        rotate: -45,
                                        rotateAlways: true,
                                        position: "top"  
                                    },
                                },
                            }
                        }],
                    };
                    
                    chart = new ApexCharts(document.querySelector("#chart"), options);
                    chart.render().then(() => {
                        // Manually override the isTouchDevice detection
                        chart.w.globals.isTouchDevice = false;
                       
                      }).catch(error => {
                        console.error('Chart failed to render:', error);
                      });
                }
                //..........
                function getChartHeight() {
                    // Get the screen height and set a percentage or adjust as needed
                    const screenHeight = window.innerHeight;
                    const chartHeight = screenHeight * 0.9; // 50% of the screen height
                    return chartHeight;
                  }
                window.ReactNativeWebView.postMessage('Chart loaded');
                
                // Export the chart as a PNG image
                async function exportChart() {
                    try {
                        const dataURI = await chart.dataURI(); // Get Base64 of chart
                        window.ReactNativeWebView.postMessage(dataURI.imgURI); // Send to React Native
                    } catch (error) {
                        console.error('Error exporting chart:', error);
                    }
                }
        
                // Bind the button to trigger export
                window.exportChart = exportChart;
            
                //.... 
                function updateChart(filteredData, updatedOptions) {
                    chart.updateSeries([{ data: filteredData }]);
                    chart.updateOptions(updatedOptions);
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({ action: 'updateChart' })
                    );
                }

                function updateChartSeries(filteredData) {
                    chart.updateSeries([{ data: filteredData }], true)
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartSeries' }));
                }

                function updateChartOptions( updatedOptions) {
                    chart.updateOptions(updatedOptions);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartOptions' }));

                }

                function resetChartSeries(){
                    chart.resetSeries();
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'resetChartSeries' }));
                }

                function appendChartData(data){
                    chart.appendData(data)
                }

                function updateLocale(newLocale) {
                    const localeOptions = newLocale === 'de' ? locales.de : locales.en;
                    const xaxisTitle= newLocale === 'de'? "Datum / Uhrzeit":"Date / Time";
                    const selectedLocale = locales[newLocale];
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateLocale',value:[newLocale,xaxisTitle] }));
                    chart.updateOptions({
                        chart: {
                            // locales: [locales.de],
                            // defaultLocale: "de",
                        },
                        tooltip: {
                            y: {
                                formatter: (value) => {
                                    const formatter = new Intl.NumberFormat(newLocale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 3 });
                                    return formatter.format(value) + " kWh";
                                },
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
                            type: "datetime",
                            tickAmount: 5,
                            title: { 
                                text: newLocale === 'de'? "Datum / Uhrzeit":"Date / Time",
                                style: {
                                fontSize: "12px",
                                fontFamily: "Helvetica, Arial, sans-serif",
                                }, 
                            },
                            labels: {
                                show: true,
                                rotate: 0,
                                rotateAlways: false,
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
                                return date.toLocaleString(newLocale === 'de' ? 'de-DE' : 'en-IN', {
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
                            title: { text: "kWh" },
                            labels: {
                                show: true,
                                minWidth: 0,
                                maxWidth: 160,
                                style: {
                                fontSize: "8px",
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontWeight: 300,
                                },
                                offsetX: -4,
                                offsetY: 0,
                                formatter: (value) => {
                                    const formatter = new Intl.NumberFormat(newLocale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 0 });
                                    return formatter.format(value);
                                }
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
                        responsive: [{
                            breakpoint: 480,
                            options: {
                            chart: { 
                                width: '100%' , 
                                height:400,
                                // background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center ",
                                background:"white",
                            }, 
                            xaxis: 
                                {   
                                    type: "datetime",
                                    tickAmount: 5,
                                    title: { 
                                        text: newLocale === 'de'? "Datum / Uhrzeit":"Date / Time" ,
                                        style: {
                                        fontSize: "12px",
                                        fontFamily: "Helvetica, Arial, sans-serif",
                                        }, 
                                    },
                                    labels: {
                                        rotate: -45,
                                        rotateAlways: true,
                                        position: "top"  
                                    },
                                },
                            }
                        }],
                    });
                }

                window.zoomIn = function () {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'Zoom Start' }));
                   
                    const currentMin = chart.w.globals.minX;
                    const currentMax = chart.w.globals.maxX;
                    const zoomAmount = (currentMax - currentMin) * 0.1;
                    chart.updateOptions({
                        xaxis: {
                            min: currentMin + zoomAmount,
                            max: currentMax - zoomAmount,
                        },
                    });
                };
                
                window.zoomOut = function () {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'Zoomed' }));
                   
                    const currentMin = chart.w.globals.minX;
                    const currentMax = chart.w.globals.maxX;
                    const zoomAmount = (currentMax - currentMin) * 0.1;
                    chart.updateOptions({
                        xaxis: {
                            min: currentMin - zoomAmount,
                            max: currentMax + zoomAmount,
                        },
                    });
                };
                window.customPanRight = function () {
                    
                    const moveFactor = (chart.w.globals.maxX - chart.w.globals.minX) * 0.2;
                  
                    const newMinX = chart.w.globals.minX + moveFactor;
                    const newMaxX = chart.w.globals.maxX + moveFactor;
                  
                    chart.updateOptions({ xaxis: { min: newMinX, max: newMaxX } });
                  };

                  window.customPanLeft = function () {
                   
                    const moveFactor = (chart.w.globals.maxX - chart.w.globals.minX) * 0.2;
                  
                    const newMinX = chart.w.globals.minX - moveFactor;
                    const newMaxX = chart.w.globals.maxX - moveFactor;
                  
                    chart.updateOptions({ xaxis: { min: newMinX, max: newMaxX } });
                  };
                window.resetZoom = function () {
                    // Dynamically access the series and x-axis data from the chart instance
                    const seriesData = chart.w.config.series[0].data;
                
                    if (seriesData.length > 0) {
                    const initialMinX = seriesData[0][0]; // First x-axis value
                    const initialMaxX = seriesData[seriesData.length - 1][0]; // Last x-axis value
                
                    chart.updateOptions({
                        xaxis: {
                        min: initialMinX,
                        max: initialMaxX,
                        },
                    });
                    } else {
                        console.error("Series data is empty, unable to reset zoom.");
                    }
                };
                
                function highlightMinAndMax(chartInstance) {
                    const seriesData = chartInstance.w.config.series[0].data;
                    
                    // Check if seriesData is an array and has valid data
                    if (!Array.isArray(seriesData) || seriesData.length === 0) {
                        console.warn('Invalid or empty series data');
                        return;
                    }
                
                    // For each data point, make sure the structure is valid (either [x, y] or { x, y })
                    if (Array.isArray(seriesData[0])) {
                        // [x, y] format
                        const minPoint = seriesData.reduce((min, point) => {
                            return point[1] < min[1] ? point : min;
                        }, [Infinity, Infinity]);
                        
                        const maxPoint = seriesData.reduce((max, point) => {
                            return point[1] > max[1] ? point : max;
                        }, [-Infinity, -Infinity]);

                        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'here1' }));
                        
                    
                        // Add annotations to the chart
                        chartInstance.clearAnnotations();
                        chartInstance.addPointAnnotation({
                            x: minPoint[0],
                            y: minPoint[1],
                            marker: {
                                size: 8,
                                fillColor: '#ff0000',
                                strokeColor: '#ffffff',
                                strokeWidth: 2,
                            },
                            label: {
                                text: 'Min',
                                style: {
                                    color: '#ff0000',
                                    fontSize: '12px',
                                },
                            },
                        });
                    
                        chartInstance.addPointAnnotation({
                            x: maxPoint[0],
                            y: maxPoint[1],
                            marker: {
                                size: 8,
                                fillColor: '#00ff00',
                                strokeColor: '#ffffff',
                                strokeWidth: 2,
                            },
                            label: {
                                text: 'Max',
                                style: {
                                    color: '#00ff00',
                                    fontSize: '12px',
                            },
                            },
                        });
                    } 
                    else if (seriesData[0].x !== undefined && seriesData[0].y !== undefined) {
                        // { x, y } format
                        const minPoint = seriesData.reduce((min, point) => {
                            return point.y < min.y ? point : min;
                        }, { x: Infinity, y: Infinity });
                        

                        const maxPoint = seriesData.reduce((max, point) => {
                            return point.y > max.y ? point : max;
                        }, { x: -Infinity, y: -Infinity });

                        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'min,max' ,values:[minPoint,maxPoint]}));
                        // Add annotations to the chart
                        chartInstance.clearAnnotations();
                        chartInstance.addPointAnnotation({
                            x: minPoint.x,
                            y: minPoint.y,
                            marker: {
                                size: 3,
                                fillColor: '#e31837',
                                strokeColor: '#ffffff',
                                strokeWidth:1,
                            },
                            label: {
                                text: 'Min',
                                style: {
                                    color: '#ff0000',
                                    fontSize: '5px',
                                },
                            },
                            
                        });
                    
                        chartInstance.addPointAnnotation({
                            x: maxPoint.x,
                            y: maxPoint.y,
                            marker: {
                                size: 3,
                                fillColor: '#e31837',
                                strokeColor: '#ffffff',
                                strokeWidth: 1,
                            },
                            label: {
                                text: 'Max',
                                style: {
                                    color: '#ff0000',
                                    fontSize: '5px',
                                },
                            },
                        });
                    } 
                    else {
                        console.warn('Invalid data format in series');
                        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'here3' }));
                    }
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
                
                window.toggleZoomAndSelection=()=> {
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
                  }
                  
              
                
                document.addEventListener("DOMContentLoaded", () => {
                    renderChart();
                });
            </script>
    </body>
</html>
`;
export let iFrameLineHtmlcontent = `
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
            series: [],
            chart: {
                height: 550,
                type: "line",
                offsetX: 0,
                offsetY: 43,
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
                        speed: 1000,
                    },
                    animategradually: {
                        enabled: true,
                        delay: 800
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
                        customIcons: [
                            {
                                icon: '<span class="apexcharts-custom-icon">🔘</span>',
                                title: 'Toggle Markers',
                                index: -8,
                                class: 'custom-icon-class custom-icon',
                                click: function () {
                                    const currentSize = chart.w.config.markers.size;
                                    const newSize = currentSize === 0 ? 5 : 0;
                                    chart.updateOptions({
                                        markers: {
                                            size: newSize
                                        }
                                    });
                                    // Update icon based on the newSize
                                    const newIcon = newSize === 0 
                                        ? '<span class="apexcharts-custom-icon">🔘</span>' 
                                        : '<span class="apexcharts-custom-icon">⭕</span>';
                        
                                    const iconElement = document.querySelector('.custom-icon-class');
                                    if (iconElement) {
                                        iconElement.innerHTML = newIcon;
                                    }
                                }
                            },
                            {
                                icon: '<span class="apexcharts-custom-icon">⬇️</span>',
                                index: -7,
                                title: 'Download Chart',
                                class: 'custom-download-icon',
                                click: function () {
                                chart.dataURI().then(({ imgURI, blob }) => {
                                    const link = document.createElement('a');
                                    link.href = imgURI;
                                    link.download = 'chart.png';
                                    link.click();
                                });
                                }
                            }
                        ]
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
                    top: -45,
                    right: 15,
                    bottom: 0,
                    left: 15,
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
                    // Large screens (Laptops/Desktops)
                    breakpoint: 1000, // For laptop and large screens
                    options: {
                        chart: {
                            height: 550,
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
                                    zoom: false,
                                    pan: false,
                                    selection: false,
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
                            height: 500,
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
                                    zoom: false,
                                    pan: false,
                                    selection: false,
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
                            height: 520,
                            background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
                            toolbar: {
                                show: true, // Hide toolbar on small screens for better UI
                                offsetX: 2,
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
                    },
                },
            ]
            
        };
        window.parent.postMessage("iframeReady", "*");
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

        window.updateChart = function(filteredData,updatedOptions) {    
            chart.updateSeries([{ data: filteredData }]);
            chart.updateOptions(updatedOptions);
        };

        window.updateChartSeries = function(filteredData) {    
            chart.updateSeries([{ data: filteredData }]);
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
export const iFreameDonutChartHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <style>
            #donut-chart {
              width: 100%;
              touch-action: none;
              align-items:center;
              justify-content:center;
              padding-top: 20px; /* Adjust as needed */
              margin-bottom: 20px;
              overflow:hidden 	   
            }
    </style>
</head>
<body >
    <div id="donut-chart"></div>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        var options = {
            series: [30, 70],
            labels: ["Open", "Closed"],
            chart: {
                type: 'donut',
                 height: '85%',
              //   width: '80%',
                background: "none",
                animations: { enabled: true },
                toolbar: { show: false },
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
                        offset: 0,
                        minAngleToShowLabel: 1,
                    },
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                        show: true, 
                        name: {
                            show: false,
                        },
                        value: {
                            show: true, 
                            fontSize: '19px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            color: "red", 
                            offsetY: 5, 
                            offsetX: 1,
                            formatter: function (val) {
                            return val + '%'; 
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
                    },
                },
            },  
            tooltip: {
                enabled: true,
                style: {
                    fontSize: "12px",
                    fontFamily: "Arial, sans-serif",
                    color: "#ffffff",
                },
                onDatasetHover: {
                    highlightDataSeries: false,  
                  },
                y: {
                    formatter: function(val) {
                        return val + "%";
                    },
                },
            },
            dataLabels: { enabled: false },
            legend: {
                show: false,
                position: 'bottom',
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
                    chart: { width: '100%' },
                    legend: { position: 'bottom' },
                },
            }],
        };

        var donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
        donutchart.render();

        //...........
        function updateChart(filteredData, updatedOptions) {
            chart.updateSeries([{ data: filteredData }]);
            chart.updateOptions(updatedOptions);
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ action: 'updateChart' })
            );
        }

        function updateChartSeries(filteredData) {
            chart.updateSeries([{ data: filteredData }], true)
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartSeries' }));
        }

        function updateChartOptions( updatedOptions) {
            chart.updateOptions(updatedOptions);
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartOptions' }));

        }

        function resetChartSeries(){
            chart.resetSeries();
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'resetChartSeries' }));
        }

        function appendChartData(data){
            chart.appendData(data)
        }
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
    });
    </script>
</body>
</html>
`;
export const webviewDonutChartHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
      <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
      <style>
              #donut-chart {
                  width: 100%;
                  height:100%;
                  touch-action: none;
              }
      </style>
  </head>
  <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh;">
      <div id="donut-chart"></div>
      <script>
      document.addEventListener("DOMContentLoaded", function() {
          var options = {
              series: [30, 70],
              labels: ["Open", "Closed"],
              chart: {
                  type: 'donut',
                  height: '95%',
                  width: '95%',
                  background: "none",
                  animations: { enabled: true },
                  toolbar: { show: false },
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
                          offset: 0,
                          minAngleToShowLabel: 1,
                      },
                      donut: {
                          size: '65%',
                          background: 'transparent',
                          labels: {
                              show: true, 
                              name: {
                                  show: false,
                              },
                              value: {
                                  show: true, 
                                  fontSize: '19px',
                                  fontFamily: 'Helvetica, Arial, sans-serif',
                                  fontWeight: 400,
                                  color: "red", 
                                  offsetY: 5, 
                                  offsetX: 1,
                                  formatter: function (val) {
                                      return val + '%'; 
                                  },
                              },
                              total: 
                              {
                                  show: false,
                                  showAlways: false,
                                  label: "Total",
                                  formatter: function (w) {
                                      return w.globals.seriesTotals.reduce((a, b) => a + b,0); 
                                  },		
                              }, 
                          },
                      },
                  },
              },  
              tooltip: {
                  enabled: true,
                  style: {
                      fontSize: "12px",
                      fontFamily: "Arial, sans-serif",
                      color: "#ffffff",
                  },
                  onDatasetHover: {
                      highlightDataSeries: false,  
                    },
                  y: {
                      formatter: function(val) {
                          return val + "%";
                      },
                  },
              },
              dataLabels: { enabled: false },
              legend: {
                  show: false,
                  position: 'bottom',
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
                      chart: { width: '100%' },
                      legend: { position: 'bottom' },
                  },
              }],
          };

          var donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
          donutchart.render();

          //...........
          function updateChart(filteredData, updatedOptions) {
              chart.updateSeries([{ data: filteredData }]);
              chart.updateOptions(updatedOptions);
              window.ReactNativeWebView.postMessage(
                  JSON.stringify({ action: 'updateChart' })
              );
          }

          function updateChartSeries(filteredData) {
              chart.updateSeries([{ data: filteredData }], true)
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartSeries' }));
          }

          function updateChartOptions( updatedOptions) {
              chart.updateOptions(updatedOptions);
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartOptions' }));

          }

          function resetChartSeries(){
              chart.resetSeries();
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'resetChartSeries' }));
          }

          function appendChartData(data){
              chart.appendData(data)
          }
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
      });
      </script>
  </body>
  </html>
`;
export const webviewAreaHtmlcontent = `
      <!DOCTYPE html>
      <html lang="en">
          <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
          <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
          <style>
              #chart {
                  width: 100%;
                  height:100%;
                  touch-action: none;
              }
          </style>
          </head>
      <body >
      <div id="chart"></div>
      <script>
      
          function getLocalizedMonths(locale = 'en-US') {
              try {
              const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
              const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));
              return months;
              } catch (error) {
              return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              }
          }
          
          let categories = getLocalizedMonths('en-IN');  // Default locale
          // Function to update the chart's locale
          function updateLocale(newLocale="en-IN") {
              categories = getLocalizedMonths(newLocale);
              chart.updateOptions({
              xaxis: {
                  categories: categories,
              }
              });
          }
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
                  data: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                  },
              ],
              colors: ["#cecece", "#e4e4e4","#b5b5b5","#c32442"],
              chart: {
                  height: 365,
                  width:'102%',
                  type: "area",
                  offsetX: -5,
                  offsetY: 0,
                  zoom: {
                      enabled: true,
                      type: 'x', 
                      autoScaleYaxis: true, 
                  },
                  background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
                  toolbar: {
                      show: false,
                      offsetX: 0,
                      offsetY: 0,
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
                      animategradually: { enabled: true, delay: 2000 },
                      initialAnimation: {enabled: true}
                  },
              },
              title: {
                  text: "Target 2024",
                  align: "left",
                  margin: 0,
                  offsetX: 40,
                  offsetY:3,
                  style: {
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#474747",
                  },
              },
              noData: {
                  text: "no data",
                  align: "center",
                  verticalAlign: "middle",
                  offsetX: 0,
                  offsetY: -50,
                  style: {
                      color: "#e31837",
                      fontSize: "25px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                  },
              },
              dataLabels: {
                  enabled: false
              },
              stroke: {
                  curve: 'smooth',width:0.5
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
                  shape: "sparkle",
                  offsetX: 0,
                  offsetY: 0,
                  onClick: undefined,
                  onDblClick: undefined,
                  showNullDataPoints: true,
                  hover: {
                      size: undefined,
                      sizeOffset: 5,
                  },
              }, 
              xaxis: {
                  type: "category",
                  categories,
                  labels: {
                  show: true,
                  rotate: -45,
                  rotateAlways: false,
                  position: "top",
                  textAnchor: "end",
                  hideOverlappingLabels: true,
                  showDuplicates: false,
                  trim: false,
                  maxHeight: 120,
                  style: 
                  {
                      fontSize: "10px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 600,
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
                      formatter: (value) => new Intl.NumberFormat("en-EN", { maximumFractionDigits: 0 }).format(value),
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
                  strokeDashArray: 1,
                  position: "back",
                  padding: {
                      top: 0,
                      right:-1,
                      bottom: 0,
                      left:5,
                  },
              },
              legend: {
                  show: true,
                  position: "bottom",
                  markers: {
                      width: 30, // Makes the marker wide like a line
                      height: 1, // Reduces the height to appear as a thin line
                      radius: 0, // No rounded corners, to maintain a line shape
                      offsetX: -5, // Adjust the position slightly
                  },
              },
              tooltip: {
                  enabled: true,
                  shared: true,  
                  followCursor: false,
                  intersect: false,
                  inverseOrder: false,
                  hideEmptySeries: true,
                  fillSeriesColor: false,
                  // theme: true,
                  style: {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    background: '#333',  
                      color: '#fff', 
                      borderRadius: '10px',  
                      padding: '10px', 
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                  },
                  onDatasetHover: {
                    highlightDataSeries: true,  
                  },
                  x: {
                      show: true,
                      format: 'MMMM',  // Display full month names
                      formatter: (value) => {
                        const months = [
                          "initial","January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"
                        ];
                        return months[value];  // Map the month number to the full month name
                      },
                  },
                  y: {
                    formatter: (value) => value + ' MW',  // Add 'MW' unit after y-axis value
                    title: {
                      formatter: (seriesName) => seriesName,  // Use the series name as the title (optional)
                    },
                  },
                  z: {
                    formatter: undefined,
                    title: 'Size: ',
                  },
                  marker: {
                    show: true,  // Show the marker for tooltips
                    fillColor: '#FF0000',  // You can specify the color of the marker (optional)
                    shape: 'circle',  // Default marker shape (circle, square, or custom)
                  },
                  items: {
                    display: 'flex', 
                  },
                  fixed: {
                    enabled: false,
                    position: 'topRight',
                    offsetX: 0,
                    offsetY: 0,
                  },
                  legend: {
                    markers: {
                      shape: 'star',  // Change the marker to a star (This is hypothetical and may require custom implementation)
                    }
                  },
                },
                
              };	

          var chart = new ApexCharts(document.querySelector("#chart"), options);
          chart.render();

          //..................................................
          function toggleMarkers() {
              // Start loader
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'startLoader' }));
              const currentSize = chart.w.config.markers.size;
              const newSize = currentSize === 0 ? 5 : 0;
              // Update chart options
              chart.updateOptions({
                  markers: {
                      size: newSize
                  },
              });
              // Stop loader after chart update
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'stopLoader' }));
          }
          
          function updateChart(filteredData, updatedOptions) {
              chart.updateSeries(filteredData);
              chart.updateOptions(updatedOptions);
              window.ReactNativeWebView.postMessage(
                  JSON.stringify({ action: 'updateChart' })
              );
          }

          function updateChartSeries(filteredData) {
              chart.updateSeries(filteredData, true)
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartSeries' }));
          }

          function updateChartOptions( updatedOptions) {
              chart.updateOptions(updatedOptions);
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartOptions' }));

          }

          function resetChartSeries(){
              chart.resetSeries();
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'resetChartSeries' }));
          }

          function appendChartData(data){
              chart.appendData(data)
          }

          // Export the chart as a PNG image
          async function exportChart() {
              try {
                  const dataURI = await chart.dataURI(); // Get Base64 of chart
                  window.ReactNativeWebView.postMessage(dataURI.imgURI); // Send to React Native
              } catch (error) {
                  console.error('Error exporting chart:', error);
              }
          }
          window.exportChart = exportChart;

          window.zoomIn = function () {
              
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'Zoom Start' }));
              const currentMin = chart.w.globals.minX;
              const currentMax = chart.w.globals.maxX;
              const zoomAmount = (currentMax - currentMin) * 0.1;
              chart.updateOptions({
                  xaxis: {
                      min: currentMin + zoomAmount,
                      max: currentMax - zoomAmount,
                  },
              });
              updateLocale()
          };
      
          window.zoomOut = function () {
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'Zoomed' }));
              const currentMin = chart.w.globals.minX;
              const currentMax = chart.w.globals.maxX;
              const zoomAmount = (currentMax - currentMin) * 0.1;
              chart.updateOptions({
                  xaxis: {
                      min: currentMin - zoomAmount,
                      max: currentMax + zoomAmount,
                  },
              });
              updateLocale()
          };
      
          window.resetZoom = function () {
              // Dynamically access the series and x-axis data from the chart instance
              const seriesData = chart.w.config.series[0].data;
              if (seriesData.length > 0) {
              const initialMinX = seriesData[0][0]; // First x-axis value
              const initialMaxX = seriesData[seriesData.length - 1][0]; // Last x-axis value
          
              chart.updateOptions({
                  xaxis: {
                  min: initialMinX,
                  max: initialMaxX,
                  },
              });
              updateLocale()
              } else {
                  console.error("Series data is empty, unable to reset zoom.");
              }
          };
      
      </script>
      </body>
      </html>
  `;
export const iframeAreahtlcontent = ` <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0/>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  </head>
  <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh;">
    <div id="chart" style="width:100%; height:100%;"></div>
    <script>
      function getLocalizedMonths(locale = 'en-US') {
          try {
          const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
          const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));
          return months;
          } catch (error) {
          return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          }
      }
      
      let categories = getLocalizedMonths('en-IN');  // Default locale
      // Function to update the chart's locale
      function updateLocale(newLocale) {
          categories = getLocalizedMonths(newLocale);
          chart.updateOptions({
          xaxis: {
              categories: categories,
          }
          });
      }
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
            height: 450,
            type: "area",
            zoom: {
              enabled: true,
              type:"x"
            },
            background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
              },
            },
            animations: {
              enabled: true,
              easing: "linear",
              speed: 1000,
              dynamicAnimation: { enabled: true, speed: 1000 },
              animategradually: { enabled: true, delay: 2000 },
              initialAnimation: {enabled: true}
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
          categories,
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
      
      function updateChart(filteredData, updatedOptions) {
          chart.updateSeries(filteredData);
          chart.updateOptions(updatedOptions);
          
      }

      function updateChartSeries(filteredData) {
          window.parent.postMessage("iframeReady", "*");
              chart.updateSeries(filteredData);
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

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    </script>
  </body>
  </html>
`;
