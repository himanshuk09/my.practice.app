export let WebviewLineHtmlContent = `<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
				<title>Simple Apex Chart</title>
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

						// if (!chart || !chart.w || !chart.w.globals || !chart.w.globals.series || chart.w.globals.series.length === 0 || chart.w.globals.series.every(s => s.length === 0)) 							{
							// 	console.warn("Chart has no data, skipping marker toggle.");
							// 	return;
						// }

						// Start loader
						window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'startLoader' }));
						const currentSize = chart.w.config.markers.size;
						const newSize = currentSize === 0 ? 2 : 0;
						window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'tooltip',values:currentSize === 0 ? true : false }));
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
								height: '285',
								background: "url('https://i.ibb.co/HdCGLJn/default-large-chart.png') no-repeat center center",
								stacked: false,
								locales: [locales.en, locales.de],
								defaultLocale: "en",
								selection: { enabled: true },
								zoom: {
									type: "x", enabled: true,
									autoScaleYaxis: true,
									zoomedArea: {
										opacity: 0.1,        		// Optional: change opacity of the zoomed area
										strokeColor: '#fff', 		// Optional: change stroke color of zoom area
									},
								},
								pan: {
									enabled: true,
									type: 'xy',
									threshold: 0
								  },
								offsetX: 0,
								offsetY: 20,
								animations: {
									enabled: false,               	// Ensure animation is enabled
									easing: "easeOutQuad",       	// Smooth easing for mobile (or use "easeInOutCubic" for even smoother)
									speed: 800,                  	// Increased speed to make the animation smoother
									dynamicAnimation: {
										enabled: true,           	// Enable dynamic animations for smooth transitions
										speed: 600,              	// Adjust the dynamic speed for better experience
									},
									animategradually: {
										enabled: true,           	// Gradual animation when needed
										delay: 1000,             	// Reduced delay for smoother gradual transitions
									},
									initialAnimation: {
										enabled: true,           	// Enable initial animation if desired
										speed: 1000,             	// Adjust the speed for initial loading animation
									},
									
								},
								toolbar: {
									show: false,
									offsetX:0,
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

										// Update chart options
										chart.updateOptions({
											xaxis: {
												min: newMinX,
												max: newMaxX,
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

									beforeZoom: function (chartContext, { xaxis, yaxis }) {

										// Access the chart's series data
										const seriesMin = chartContext.w.globals.seriesX[0][0]; // Minimum x-value in the dataset
										const seriesMax = chartContext.w.globals.seriesX[0][chartContext.w.globals.seriesX[0].length - 1]; // Maximum x-value in the dataset

										const minDistanceBetweenPoints =
											chartContext.w.globals.seriesX[0][1] - chartContext.w.globals.seriesX[0][0]; // Distance between two consecutive points

										// Ensure at least one point is visible in the zoomed range
										const newMinX = Math.max(xaxis.min, seriesMin);
										const newMaxX = Math.min(xaxis.max, seriesMax);

										if (newMaxX - newMinX < minDistanceBetweenPoints) {
											// Prevent zooming if no point would be visible
											window.ReactNativeWebView.postMessage(
												JSON.stringify({ action: 'Zoom Prevented', reason: 'No data points visible' })
											);
											return {
												xaxis: {
													min: chartContext.w.globals.minX,
													max: chartContext.w.globals.maxX,
												},
												yaxis,
											};
										}

										// Post zoom start event
										window.ReactNativeWebView.postMessage(
											JSON.stringify({ action: 'Zoom Start', newRange: { min: newMinX, max: newMaxX } })
										);

										// Allow zooming with validated values
										return {
											xaxis: {
												min: newMinX,
												max: newMaxX,
											},
											yaxis,
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
										document
										.querySelector(".apexcharts-canvas")
										?.addEventListener("touchstart", (e) => {}, { passive: true });
									},

									dataPointSelection: function (event, chartContext, config) {
										window.ReactNativeWebView.postMessage(
											JSON.stringify({ action: 'dataPointSelection' })
										);
									},

									updated: function (chartContext) {
										window.ReactNativeWebView.postMessage(
											JSON.stringify({ action: 'Chart updated'})
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
							// 		// top: -20,
							// 		// right:10,
							// 		// bottom: -5,
							// 		// left:0,
							// 	},
							// },

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
									rotateAlways: true,
									textAnchor: "start",
									hideOverlappingLabels: false,
									showDuplicates: false,
									trim: false,
									maxHeight: 120,
									offsetX: 5,
									offsetY: 10,
									style:
									{
										fontSize: "8px",
										fontFamily: "Helvetica, Arial, sans-serif",
										fontWeight: 300,
										// cssClass: 'apexcharts-xaxis-label',
									},

									formatter: (value) => {
										const date = new Date(value);
										return date.toLocaleString("en-IN", {
											year: "numeric",
											month: "short",
											day: "2-digit",
											// timeZone: "Europe/Berlin",
										});
									},
								},
								// axisBorder: {
								// 	show: true,
								// 	color: "#78909C",
								// 	height: 1,
								// 	width: "100%",
								// 	offsetX: 0,
								// 	offsetY: 0,
								// },
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
									position: 'back',
									opacity: 0.9,
									stroke: {
										color: '#b6b6b6',
										width: 0,
										dashArray: 1,
									},
									fill: {
										type: 'solid',
										color: '#B1B9C4',
										gradient: {
											colorFrom: '#D8E3F0',
											colorTo: '#BED1E6',
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
									text: "kWh",
									rotate: -90,
									offsetX: 0,
									offsetY: 0,
									style: {
										color: "undefined",
										fontSize: '12px',
										fontFamily: 'Helvetica, Arial, sans-serif',
										fontWeight: 600,
										cssClass: 'apexcharts-yaxis-title',
									  },
								},
								labels: {
									show: true,
									minWidth: 0,
									maxWidth: 160,
									style: {
										fontSize: "8px",
										fontFamily: "Helvetica, Arial, sans-serif",
										fontWeight: 300,
									},
									offsetX: 0,//y axis labels
									offsetY: 0,
									formatter: (value) => new Intl.NumberFormat("en-EN", { maximumFractionDigits: 3 }).format(value),
								},

								// axisBorder: {
								// 	show: true,
								// 	color: "#78909C",
								// 	height: "100%",
								// 	width:1,
								// 	offsetX: -1,
								// 	offsetY: 0,
								// },
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
								points: []
							},

							tooltip: {
								enabled: true,
								shared: false,
								intersect: false,
								hideEmptySeries: true,
								fillSeriesColor: false,
								offsetX: 10,
								offsetY: 10,
								style: {
									fontSize: '10px',
									fontFamily: 'Arial, sans-serif',
									background: '#333',
									color: '#fff',
									borderRadius: '10px',
									padding: '1px',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
								},
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
										// timeZone: "Europe/Berlin",
										});
									},
								},
								marker: {
									show: true,
									radius: 1 // Adjust this value to change the size of the hover circle
								},
								fixed: {
									enabled: false,
									position: 'topRight',
									offsetX: 0,
									offsetY: 0,
								},
							},
							fill: {
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
										height:'95%',
										background: "url('https://i.ibb.co/wgS847n/default-large-chart.png') no-repeat center center",
									},
								},
							}],
						};

						chart = new ApexCharts(document.querySelector("#chart"), options);
						chart.render().then(() => {
							chart.w.globals.isTouchDevice = false;
						  }).catch(error => {
							console.error('Chart failed to render:', error);
						  });
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

					// Bind the button to trigger export
					window.exportChart = exportChart;


					function updateChart(filteredData, updatedOptions) {
						chart.updateSeries([{ data: filteredData }]);
						chart.updateOptions(updatedOptions);
						window.ReactNativeWebView.postMessage(
							JSON.stringify({ action: 'updateChart' })
						);
					}

					function updateChartSeries(title,filteredData) {
						chart.updateSeries([{ name:title,data: filteredData }], true)
						window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateChartSeries',values:title }));
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

					function updateLocale(newLocale,yAxisTitle) {

						const xaxisTitle= newLocale === 'de'? "Datum / Uhrzeit":"Date / Time";
						const selectedLocale = locales[newLocale];

						window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'updateLocale',value:[newLocale,xaxisTitle] }));

						chart.updateOptions({
							chart:{
								background: "url('https://i.ibb.co/wgS847n/default-large-chart.png') no-repeat center center",		
							},
							tooltip: {
								y: {
									formatter: (value) => {
										const formatter = new Intl.NumberFormat(newLocale === 'de' ? 'de-DE' : 'en-IN', { maximumFractionDigits: 2 });
										return formatter.format(value) +" " + yAxisTitle;
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
										// timeZone: "Europe/Berlin",
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
								axisTicks: {
									show: true,
								},
							},
							yaxis: {
								title: {
									text: yAxisTitle,
									rotate: -90,
									offsetX: 0,
									offsetY: 0,
									style: {
										color: "undefined",
										fontSize: '12px',
										fontFamily: 'Helvetica, Arial, sans-serif',
										fontWeight: 700,
										cssClass: 'apexcharts-yaxis-title',
									  },
								},
								labels: {
									show: true,
									minWidth: 0,
									maxWidth: 160,
									style: {
										fontSize: "8px",
										fontFamily: "Helvetica, Arial, sans-serif",
										fontWeight: 300,
									},
									formatter: (value) => new Intl.NumberFormat("en-EN", { maximumFractionDigits: 3 }).format(value),
								},

							},
							responsive: [{
								breakpoint: 480,
								options: {
									chart: {
										height:'95%',
										background: "url('https://i.ibb.co/wgS847n/default-large-chart.png') no-repeat center center",
									},
								}
							}],
						});
					}

					function updateFormate(type,locale) {
						window.ReactNativeWebView.postMessage(
							JSON.stringify({ action: 'updateFormate' })
						);

						let newLocale=locale==="de"?"de-DE":"en-EN";

						chart.updateOptions({
							xaxis: {
								labels: {
									formatter: (value) => {
										const xAxisData = chart.w.globals.initialSeries[0].data;
										const index = chart.w.globals.labels.indexOf(value);
										const date = new Date(value);
										let formatOptions = {};
										switch (type) {
											case 'Day':
													if (index === 0) {
														formatOptions ={
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
															// timeZone: "Europe/Berlin",
														};
													}
												break;
											case 'Week':
											case 'Month':
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
													// timeZone: "Europe/Berlin",
												};
												break;
										}

										return date.toLocaleString(newLocale, formatOptions);
									},
								},
							},
						})
					}

					window.zoomIn = function () {
						if (chart?.w?.globals) {
							window.ReactNativeWebView.postMessage(
								JSON.stringify({ action: 'Zoom Start' })
							);

							const currentMin = chart.w.globals.minX;
							const currentMax = chart.w.globals.maxX;
							const zoomAmount = (currentMax - currentMin) * 0.1;

							// Ensure the new zoomed range stays within the series bounds
							const newMinX = Math.max(
								currentMin + zoomAmount,
								chart.w.globals.seriesX[0][0] // Series minimum
							);
							const newMaxX = Math.min(
								currentMax - zoomAmount,
								chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] // Series maximum
							);

							// Update chart options
							chart.updateOptions({
								xaxis: {
									min: newMinX,
									max: newMaxX,
								},
							});
						} else {
							console.warn('Zoom In action skipped: chart or required properties not available.');
						}
					};

					window.zoomOut = function () {
						if (chart?.w?.globals) {
							window.ReactNativeWebView.postMessage(
								JSON.stringify({ action: 'Zoomed' })
							);

							const currentMin = chart.w.globals.minX;
							const currentMax = chart.w.globals.maxX;
							const zoomAmount = (currentMax - currentMin) * 0.1;

							// Ensure the new zoomed range stays within the series bounds
							const newMinX = Math.max(
								currentMin - zoomAmount,
								chart.w.globals.seriesX[0][0] // Series minimum
							);
							const newMaxX = Math.min(
								currentMax + zoomAmount,
								chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] // Series maximum
							);

							// Update chart options
							chart.updateOptions({
								xaxis: {
									min: newMinX,
									max: newMaxX,
								},
							});
						} else {
							console.warn('Zoom Out action skipped: chart or required properties not available.');
						}
					};

					window.customPanLeft = function () {
						const moveFactor = (chart.w.globals.maxX - chart.w.globals.minX) * 0.3;

						// Calculate the new min and max X values for the pan
						const newMinX = Math.max(chart.w.globals.minX - moveFactor, chart.w.globals.seriesX[0][0]); 		// Prevent going past the series minimum
						const newMaxX = Math.max(chart.w.globals.maxX - moveFactor, chart.w.globals.seriesX[0][0] + (chart.w.globals.maxX - chart.w.globals.minX));   // Prevent going past the series minimum

						// Update chart options to apply the pan
						chart.updateOptions({
						  xaxis: {
							min: newMinX,
							max: newMaxX
						  }
						}); // false, false to not animate the chart and not update the series
					  };

					  window.customPanRight = function () {

						const moveFactor = (chart.w.globals.maxX - chart.w.globals.minX) * 0.3;

						// Calculate the new min and max X values for the pan

						// Prevent going past the series maximum
						const newMinX = Math.min(chart.w.globals.minX + moveFactor, chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] - (chart.w.globals.maxX - chart.w.globals.minX));
						// Prevent going past the series maximum
						const newMaxX = Math.min(chart.w.globals.maxX + moveFactor, chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1]);

						// Update chart options to apply the pan
						chart.updateOptions({
						  xaxis: {
							min: newMinX,
							max: newMaxX
						  }
						}); // false, false to not animate the chart and not update the series
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
							// console.log('Invalid or empty series data');
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

					// function ZoomData(){
					// 	chart.zoomX(
					// 		new Date('01 Jan 2021').getTime(),
					// 		new Date('27 Feb 2021').getTime()
					// 	  )
					// }
					function ZoomData() {
						// Parse the dates correctly
						const startDate = new Date('01/01/2021 00:00').getTime();
						const endDate = new Date('01/13/2021 23:00').getTime();
					  
						// Zoom the chart to the specified date range
						chart.zoomX(startDate, endDate);
					}
					function ZoomMonthData(){
						chart.zoomX(
							new Date('01 Jan 2023').getTime(),
							new Date('31 Jan 2023').getTime()
						  )	
					}
					function ZoomWeekData(){
						chart.zoomX(
							new Date('01 Jan 2023').getTime(),
							new Date('07 Jan 2023').getTime()
						  )	
					}
					function ZoomDayData(){
						chart.zoomX(
							new Date('01 Jan 2023').getTime(),
							new Date('02 Jan 2023').getTime()
						  )	
					}
					function ZoomQuarterData(){
						chart.zoomX(
							new Date('01 Jan 2023').getTime(),
							new Date('30 May 2023').getTime()
						  )	
					}
					function ResetData() {
						chart.resetSeries();
					}

					document.addEventListener("DOMContentLoaded", () => {
						renderChart();
					});
					(function() {
						var originalAddEventListener = EventTarget.prototype.addEventListener;
						EventTarget.prototype.addEventListener = function(type, listener, options) {
						  if (type === "touchstart" || type === "touchmove") {
							options = options || {};
							if (typeof options === "object") {
							  options.passive = true;
							}
						  }
						  return originalAddEventListener.call(this, type, listener, options);
						};
					  })();
				</script>
		</body>
	</html>
	`;
export let iFrameLineHtmlcontent = `<!DOCTYPE html>
			<html lang="en">
			<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" user-scalable=no" maximum-scale=1.0/>
			<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
			</head>
			<body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh;">
			<div id="chart" style="width:95%; height:100%; overflow:hidden"></div>
			<script>
					function sendMessageToReactNative(message) {
						if (window.ReactNativeWebView) {
							// If inside WebView (Android/iOS)
							window.ReactNativeWebView.postMessage("Hello from iframe (WebView)");
						} else {
							// If inside iframe (Web)
							window.parent.postMessage(message, "*");
						}
					}

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
						series: [{name:"",data:[]}],
						chart: {
							height: "90%",
							type: "line",
							offsetX: 0,
							offsetY: 30,
							background: "url('https://i.ibb.co/ryQkmKq/new.png') no-repeat center center",
							backgroundSize: "cover",
							stacked: false,
							locales: [locales.en, locales.de],
							defaultLocale: "en",
							zoom: { type: "x", enabled: true, autoScaleYaxis: true },
							animations: {
								enabled: false,
								easing: "linear",
								speed: 500,
								dynamicAnimation: {
									enabled: true,
									speed: 1000,
								},
								animategradually: {
									enabled: true,
									delay: 1000
								},
								initialAnimation: {
									enabled: false,           // Enable initial animation if desired
									speed: 1000,             // Adjust the speed for initial loading animation
								},
							},
							selection: {
								enabled: false,
							},
							events:{
								updated: function (chartContext) {
									sendMessageToReactNative("Chart updated");
									highlightMinAndMax(chartContext);
								},

								mounted: function (chartContext) {
									highlightMinAndMax(chartContext);
									document
										.querySelector(".apexcharts-canvas")
										?.addEventListener("touchstart", (e) => {}, { passive: true });
								},

								beforeZoom: function (chartContext, { xaxis, yaxis }) {

									// Access the chart's series data
									const seriesMin = chartContext.w.globals.seriesX[0][0]; // Minimum x-value in the dataset
									const seriesMax = chartContext.w.globals.seriesX[0][chartContext.w.globals.seriesX[0].length - 1]; // Maximum x-value in the dataset

									const minDistanceBetweenPoints =
										chartContext.w.globals.seriesX[0][1] - chartContext.w.globals.seriesX[0][0]; // Distance between two consecutive points

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
									selection: true,
									customIcons: [
										{
											icon: '<span class="apexcharts-custom-icon">🔘</span>',
											title: 'Toggle Markers',
											index: -8,
											class: 'custom-icon-class custom-icon',
											click: function () {
												sendMessageToReactNative("startLoader")
												const currentSize = chart.w.config.markers.size;
												const newSize = currentSize === 0 ? 4 : 0;
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
												sendMessageToReactNative("stopLoader")
											}
										},

									]
								},
							},
						},
						dataLabels: {
							enabled: false
						},

						stroke: { curve: "monotoneCubic", width: 2 },//['straight', 'smooth', 'monotoneCubic', 'stepline']
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

						markers: {
							size: 0,
							colors: "#e31837",
							strokeColors: "black",
							strokeWidth: 0.7,
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
								position: 'back',
								opacity: 0.9,
								stroke: {
									color: '#b6b6b6',
									width: 0,
									dashArray: 1,
								},
								fill: {
									type: 'solid',
									color: '#B1B9C4',
									gradient: {
										colorFrom: '#D8E3F0',
										colorTo: '#BED1E6',
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
								text: "kWh",
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
										// height: 550,
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
										// height: 500,
										 background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
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
										height: "88%",
										background: "url('https://i.ibb.co/sKQJv9t/resize-17319237671164076911defaultlargechart.png') no-repeat center center",
										toolbar: {
											show: true,
											offsetX: 2,
											offsetY: 0,
											autoSelected: "zoom",
											tools: {
												download: true,
												selection: false,
												zoom: false,
												zoomin: true,
												zoomout: true,
												pan: false,
											  },
										},
									},
									xaxis: {
										type: 'datetime',
										labels: {
											show: true,
											// rotate: -45,
											// rotateAlways: true,
											// position: "top",
											// textAnchor: "end",
											hideOverlappingLabels: true,
											showDuplicates: false,
											trim: false,
											maxHeight: 120,
											style: {
												fontSize: "8px",
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
									},
									yaxis: {
										title: {
											text: "kWh",
										},
										labels: {
											show: true,
											minWidth: 0,
											maxWidth: 160,
											style: {
												fontSize: "8px",
												fontFamily: "Helvetica, Arial, sans-serif",
												fontWeight: 400,
											},
											offsetX: 0,
											offsetY: 0,
											formatter: (val) => {
												return val.toLocaleString("en-IN");
											},
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
											top: -25,
											right: 15,
											bottom: 0,
											left: 10,
										},
									},
								},
							},
						]

					};

					var chart = new ApexCharts(document.querySelector("#chart"), options);
					chart.render();

					window.updateChart = function(filteredData,updatedOptions) {
						chart.updateSeries([{  name: "Energy Use",data: filteredData }]);
						chart.updateOptions(updatedOptions);

					};

					window.updateChartSeries = function(title,filteredData) {
						chart.updateSeries([{  name: title,data: filteredData }]);
						sendMessageToReactNative("updateChartSeries")
					};

					window.updateChartOptions = function(updatedOptions) {
						chart.updateOptions(updatedOptions);
						sendMessageToReactNative("updateChartOptions")
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
									// timeZone: "Europe/Berlin",
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
										// timeZone: "Europe/Berlin",
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

					   //..........
						let isZoomed = false;

						window.isChartZoomed = function () {
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
								isZoomed = true;  // Zoomed state is true
								return true;
							} else {
								isZoomed = false;  // Zoomed state is false
								return false;
							}
						};

						// Function to set the zoomed state from outside the WebView
						window.setChartZoomedState = function (zoomed) {
							isZoomed = zoomed;
							console.log("Zoomed state is set to:", isZoomed);
						};

						// Function to reset zoom based on the zoomed state
						window.resetZoom = function () {
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

						//............

						function updateFormate(type="Week",locale="en") {

							let newLocale=locale==="de"?"de-DE":"en-EN";
							chart.updateOptions({
								xaxis: {
									labels: {
										formatter: (value) => {
											const xAxisData = chart.w.globals.initialSeries[0].data;
											const index = chart.w.globals.labels.indexOf(value);
											const date = new Date(value);
											let formatOptions = {};
											switch (type) {
												case 'Day':
														// formatOptions = {
														//     year: "numeric",
														//     month: "short",
														//     day: "2-digit",
														//     hour: "2-digit",
														//     minute: "2-digit",
														//     timeZone: "Europe/Berlin",
														// };
														if (index === 0) {
															formatOptions ={
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
												case 'Week':
												case 'Month':
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
							})
						}

						function highlightMinAndMax(chartInstance) {
							const seriesData = chartInstance.w.config.series[0].data;

							// Check if seriesData is an array and has valid data
							if (!Array.isArray(seriesData) || seriesData.length === 0) {
								// console.warn('Invalid or empty series data');
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

								// Add annotations to the chart
								chartInstance.clearAnnotations();
								chartInstance.addPointAnnotation({
									x: minPoint.x,
									y: minPoint.y,
									marker: {
										size: 5,
										fillColor: '#e31837',
										strokeColor: '#ffffff',
										strokeWidth:1,
									},
									label: {
										text: 'Min',
										style: {
											color: '#ff0000',
											fontSize: '10px',
										},
									},

								});

								chartInstance.addPointAnnotation({
									x: maxPoint.x,
									y: maxPoint.y,
									marker: {
										size: 5,
										fillColor: '#e31837',
										strokeColor: '#ffffff',
										strokeWidth: 1,
									},
									label: {
										text: 'Max',
										style: {
											color: '#ff0000',
											fontSize: '10px',
										},
									},
								});
							}
							else {
								console.log('Invalid data format in series');

							}
						}
						function ZoomMonthData(){
							chart.zoomX(
								new Date('01 Jan 2023').getTime(),
								new Date('31 Jan 2023').getTime()
							  )	
						}
						function ZoomWeekData(){
							chart.zoomX(
								new Date('01 Jan 2023').getTime(),
								new Date('07 Jan 2023').getTime()
							  )	
						}
						function ZoomDayData(){
							chart.zoomX(
								new Date('01 Jan 2023').getTime(),
								new Date('02 Jan 2023').getTime()
							  )	
						}
						function ZoomQuarterData(){
							chart.zoomX(
								new Date('01 Jan 2023').getTime(),
								new Date('30 May 2023').getTime()
							  )	
						}
						function ResetData() {
							chart.resetSeries();
						}
						(function() {
							var originalAddEventListener = EventTarget.prototype.addEventListener;
							EventTarget.prototype.addEventListener = function(type, listener, options) {
							  if (type === "touchstart" || type === "touchmove") {
								options = options || {};
								if (typeof options === "object") {
								  options.passive = true;
								}
							  }
							  return originalAddEventListener.call(this, type, listener, options);
							};
						  })();
			</script>
			</body>
			</html>
	`;
export const iFreameDonutChartHtml = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
			<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
			<style>
					#donut-chart {
					  touch-action: none;
					  overflow:hidden;
					  height:"100%";
					  width:"100%";

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
						height: '120%',
						width: '100%',
						background: "none",
						animations: { 
							enabled: true,
							easing: "linear",
							speed: 1000,
							dynamicAnimation: { enabled: true, speed: 1000 },
							animategradually: { enabled: true, delay: 2000 },
							initialAnimation: {enabled: true} 
						},
						toolbar: { show: false },
					},
					noData: {
						text: "N/A",
						align: "center",
						verticalAlign: "middle",
						offsetX: 0,
						offsetY: -10,
						style: {
							color: "#e31837",
							fontSize: "25px",
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
								offset: 0,
								minAngleToShowLabel: 1,
							},
							donut: {
								size: '65%',
								background: 'transparent',
								labels: {
								show: true,
								name: {
									show: true,
									fontSize: '15px',
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 600,
									color: undefined,
									offsetY: -10,
									formatter: function (val) {
										  return val
									}
								},
								value: {
									show: true,
									fontSize: '15px',
									fontFamily: 'Helvetica, Arial, sans-serif',
									fontWeight: 500,
									color: undefined,
									offsetY: -5,
									offsetX: -5,
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
						enabledOnSeries: undefined,
						shared: true,
						followCursor: true,
						intersect: false,
						inverseOrder: false,
						custom: undefined,
						hideEmptySeries: false,
						fillSeriesColor: true,
						theme: false,
						x: {
							show: true,
							formatter: function (val) {
								return val + '%';
							},
						},
						style: {
							  fontSize: '12px',
							  fontFamily: undefined,
							  backgroundColor: "#fff",
						},
						onDatasetHover: {
							highlightDataSeries: false,
						},
					},
					dataLabels: { enabled: false },
					legend: {
						show: false,
					},
					fill: {
						type:'gradient',
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
							chart: { width: '100%',height:"95%" },
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
						  	series: [70,30],
						  	labels: ["Open", "Closed"],
						  	chart: {
								type: 'donut',
								height: '95%',
								width: '95%',
								background: "none",
								animations: { 
									enabled: true,
									easing: "linear",
									speed: 1000,
									dynamicAnimation: { enabled: true, speed: 1000 },
									animategradually: { enabled: true, delay: 2000 },
									initialAnimation: {enabled: true} 
								},
								toolbar: { show: false },
						    },
							noData: {
								text: "N/A",
								align: "center",
								verticalAlign: "middle",
								offsetX: 0,
								offsetY: -10,
								style: {
									color: "#e31837",
									fontSize: "25px",
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
										offset: 0,
										minAngleToShowLabel: 0,
									},
									donut:  {
												size: '65%',
												background: 'transparent',
												labels: {
													show: true,
													name: {
														show: true,
														fontSize: '15px',
														fontFamily: 'Helvetica, Arial, sans-serif',
														fontWeight: 600,
														color: undefined,
														offsetY: -10,
														formatter: function (val) {
													  		return val
														}
													},
											    	value: {
												    	show: true,
												    	fontSize: '15px',
												    	fontFamily: 'Helvetica, Arial, sans-serif',
												    	fontWeight: 500,
												    	color: undefined,
												    	offsetY: -5,
												    	offsetX: -5,
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
								enabledOnSeries: undefined,
								shared: true,
								followCursor: true,
								intersect: false,
								inverseOrder: false,
								custom: undefined,
								hideEmptySeries: false,
								fillSeriesColor: true,
								theme: false,
								x: {
									show: true,
									formatter: function (val) {
										return val + '%';
									},
								},
								style: {
								  	fontSize: '12px',
								  	fontFamily: undefined,
								  	backgroundColor: undefined,
								},
								onDatasetHover: {
									highlightDataSeries: false,
								},
							},
						  	dataLabels: { enabled: false },
						  	legend: {
							  	show: false,
						  	},
							  fill: {
								type:'gradient',
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
							  	},
						  	}],
					  	};

						  var donutchart = new ApexCharts(document.querySelector("#donut-chart"), options);
						  donutchart.render();

						  //...........
						    function updateChart(filteredData, updatedOptions) {
							    chart.updateSeries([{ data: filteredData }],true);
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
						  	width: 100%;
						  	position: absolute;
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
						}
						catch (error) {
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
							name: "Forward",
							data: [25, 40, 20, 15, 10, 30, 10, 25, 15, 30, 20, 35],
						},
						{
							name: "IbISwing",
							data: [25, 15, 20, 25, 15, 15, 20, 10, 35, 25, 30, 20],
						},
						{
							name: "IbIspot",
							data: [35, 20, 10, 15, 30, 25, 20, 10, 30, 25, 35, 20],
						},
						{
							name: "Closed",
							data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
						},
					  ],
				  	// colors: ["#e4e4e4","#cecece", "#b5b5b5","#c32442"],
				  	colors: ["#a9a9a9","#8f8f8f", "#757575","#c32442"],
				  	chart: {
						height: '100%',
						width:'102%',
						type: "area",
						offsetX: -5,
						offsetY: 0,
						zoom: {
							enabled: true,
							type: 'x',
							autoScaleYaxis: true,
						},
						background: "url('https://i.ibb.co/wgS847n/default-large-chart.png') no-repeat center center",
						toolbar: {
							show: false,
							offsetX: 0,
							offsetY: 0,
							autoSelected:'zoom',
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
						events:{
							// selection: function(chartContext, { xaxis, yaxis }) {
							// 	window.ReactNativeWebView.postMessage(
							// 		JSON.stringify({ action: 'selection',values:[xaxis,yaxis] })
							// 	);
							// 	const currentMin = chart.w.globals.minX;
							// 	const currentMax = chart.w.globals.maxX;
							// 	const zoomAmount = (currentMax - currentMin) * 0.1;
							// 	chart.updateOptions({
							// 		xaxis: {
							// 			min: currentMin - zoomAmount,
							// 			max: currentMax + zoomAmount,
							// 		},
							// 	});
							// 	updateLocale();
							// },
							selection: function(chartContext, { xaxis, yaxis }) {
								window.ReactNativeWebView.postMessage(
									JSON.stringify({ action: 'selection', values: [xaxis, yaxis] })
								);

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
								updateLocale();
							},
						}
				    },
				  	title: {
					  	text: "Target 2024",
					  	align: "center",
					  	margin: 0,
					  	offsetX: 0,
					  	offsetY:10,
					  	style: {
						  	fontSize: "13px",
						  	fontWeight: "500",
						  	color: "#474747",
					 	 },
				  	},
				  	noData: {
					  	text: "Data not available",
					  	align: "center",
					  	verticalAlign: "middle",
					  	offsetX: 0,
					  	offsetY: -50,
					  	style: {
						  	color: "#e31837",
						  	fontSize: "12px",
							  fontWeight: "900",
						  	fontFamily: "Helvetica, Arial, sans-serif",
					  	},
				  	},
				  	dataLabels: {
					  	enabled: false
				  	},
				  	stroke: {
					  	curve: 'monotoneCubic',width:0.5//['straight', 'smooth', 'monotoneCubic', 'stepline']
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
						  	size: undefined,
						  	sizeOffset: 5,
					  	},
				  	},
				  	xaxis: {
						type: "category",
						categories,
						labels: {
							show: true,
							// rotate: -45,
							// rotateAlways: false,
							position: "top",
							textAnchor: "start",
							hideOverlappingLabels: true,
							showDuplicates: false,
							trim: false,
							maxHeight: 120,
							offsetX: 0,
							offsetY: 0,
							style:
							{
								fontSize: "9px",
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
						crosshairs: {
							show: false,
							width: 0,
							position: 'back',
							opacity: 0.9,
							stroke: {
								color: '#b6b6b6',
								width: 0,
								dashArray: 1,
							},
							fill: {
								type: 'solid',
								color: '#B1B9C4',
								gradient: {
									colorFrom: '#D8E3F0',
									colorTo: '#BED1E6',
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
							shape:"line",
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
						hideEmptySeries: true,
						fillSeriesColor: false,
						// theme: true,
						style: {
							fontSize: '8px',
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
							shape: 'line',
							offsetX: 0,
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
					if (chart?.w?.globals) {
						window.ReactNativeWebView.postMessage(
							JSON.stringify({ action: 'Zoom Start' })
						);

						const currentMin = chart.w.globals.minX;
						const currentMax = chart.w.globals.maxX;
						const zoomAmount = (currentMax - currentMin) * 0.1;

						// Ensure the new zoomed range stays within the series bounds
						const newMinX = Math.max(
							currentMin + zoomAmount,
							chart.w.globals.seriesX[0][0] // Series minimum
						);
						const newMaxX = Math.min(
							currentMax - zoomAmount,
							chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] // Series maximum
						);

						// Update chart options
						chart.updateOptions({
							xaxis: {
								min: newMinX,
								max: newMaxX,
							},
						});
						updateLocale()
					} else {
						console.warn('Zoom In action skipped: chart or required properties not available.');
					}
				};

				window.zoomOut = function () {
					if (chart?.w?.globals) {
						window.ReactNativeWebView.postMessage(
							JSON.stringify({ action: 'Zoomed' })
						);

						const currentMin = chart.w.globals.minX;
						const currentMax = chart.w.globals.maxX;
						const zoomAmount = (currentMax - currentMin) * 0.1;

						// Ensure the new zoomed range stays within the series bounds
						const newMinX = Math.max(
							currentMin - zoomAmount,
							chart.w.globals.seriesX[0][0] // Series minimum
						);
						const newMaxX = Math.min(
							currentMax + zoomAmount,
							chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] // Series maximum
						);

						// Update chart options
						chart.updateOptions({
							xaxis: {
								min: newMinX,
								max: newMaxX,
							},
						});
						updateLocale()
					} else {
						console.warn('Zoom Out action skipped: chart or required properties not available.');
					}
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

				window.customPanLeft = function () {
					const moveFactor = (chart.w.globals.maxX - chart.w.globals.minX) * 0.5;

					// Calculate the new min and max X values for the pan
					const newMinX = Math.max(chart.w.globals.minX - moveFactor, chart.w.globals.seriesX[0][0]); // Prevent going past the series minimum
					const newMaxX = Math.max(chart.w.globals.maxX - moveFactor, chart.w.globals.seriesX[0][0] + (chart.w.globals.maxX - chart.w.globals.minX)); // Prevent going past the series minimum

					// Update chart options to apply the pan
					chart.updateOptions({
					  xaxis: {
						min: newMinX,
						max: newMaxX
					  }
					}); // false, false to not animate the chart and not update the series
					updateLocale()
				  };
				  window.customPanRight = function () {
					const moveFactor = (chart.w.globals.maxX - chart.w.globals.minX) * 0.5;

					// Calculate the new min and max X values for the pan

					// Prevent going past the series maximum
					const newMinX = Math.min(chart.w.globals.minX + moveFactor, chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1] - (chart.w.globals.maxX - chart.w.globals.minX));

					// Prevent going past the series maximum
					const newMaxX = Math.min(chart.w.globals.maxX + moveFactor, chart.w.globals.seriesX[0][chart.w.globals.seriesX[0].length - 1]);

					// Update chart options to apply the pan
					chart.updateOptions({
					  xaxis: {
						min: newMinX,
						max: newMaxX
					  }
					}); // false, false to not animate the chart and not update the series
					updateLocale()
				  };

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
						height: "90%",
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
					responsive: [{
						breakpoint: 480,
						options: {
							chart: {
								height: "90%",
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
										selection: false,
										zoom: false,
										zoomin: true,
										zoomout: true,
										pan: false,
								  	},
								},
							},
						},
					}],
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
