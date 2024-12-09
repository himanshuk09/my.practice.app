interface AnnotationLabel {
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  text?: string;
  textAnchor?: string;
  position?: string;
  orientation?: string;
  offsetX?: number;
  offsetY?: number;
  mouseEnter?: () => void;
  mouseLeave?: () => void;
  click?: () => void;
  style?: {
    background?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: number;
    fontFamily?: string;
    cssClass?: string;
  };
}

interface AnnotationPoint {
  x?: number;
  y?: number | null;
  yAxisIndex?: number;
  seriesIndex?: number;
  mouseEnter?: () => void;
  mouseLeave?: () => void;
  click?: () => void;
  marker?: {
    size?: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    shape?: string;
    radius?: number;
    OffsetX?: number;
    OffsetY?: number;
    cssClass?: string;
  };
  label?: AnnotationLabel;
  image?: {
    path?: string;
    width?: number;
    height?: number;
    offsetX?: number;
    offsetY?: number;
  };
}

interface Annotation {
  yaxis?: Array<{
    y?: number;
    y2?: number | null;
    strokeDashArray?: number;
    borderColor?: string;
    fillColor?: string;
    opacity?: number;
    offsetX?: number;
    offsetY?: number;
    width?: string;
    yAxisIndex?: number;
    label?: AnnotationLabel;
  }>;
  xaxis?: Array<{
    x?: number;
    x2?: number | null;
    strokeDashArray?: number;
    borderColor?: string;
    fillColor?: string;
    opacity?: number;
    offsetX?: number;
    offsetY?: number;
    label?: AnnotationLabel;
  }>;
  points?: AnnotationPoint[];
  texts?: Array<{
    x?: number;
    y?: number;
    text?: string;
    textAnchor?: string;
    foreColor?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: number;
    appendTo?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  }>;
  images?: Array<{
    path?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    appendTo?: string;
  }>;
}
interface DataLabelStyle {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  colors?: string[];
}

interface DropShadow {
  enabled?: boolean;
  top?: number;
  left?: number;
  blur?: number;
  color?: string;
  opacity?: number;
}

interface DataLabelBackground {
  enabled?: boolean;
  foreColor?: string;
  padding?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  dropShadow?: DropShadow;
}

interface DataLabels {
  enabled?: boolean;
  enabledOnSeries?: number | undefined;
  formatter?: (val: any, opts: any) => any;
  textAnchor?: string;
  distributed?: boolean;
  offsetX?: number;
  offsetY?: number;
  style?: DataLabelStyle;
  background?: DataLabelBackground;
  dropShadow?: DropShadow;
}
interface Gradient {
  shade?: "light" | "dark";
  type?: "horizontal" | "vertical" | "diagonal1" | "diagonal2";
  shadeIntensity?: number;
  gradientToColors?: string[] | undefined;
  inverseColors?: boolean;
  opacityFrom?: number;
  opacityTo?: number;
  stops?: number[];
  colorStops?: any[]; // You can define a more specific type based on your needs
}

interface Image {
  src?: string[];
  width?: number;
  height?: number;
}

interface Pattern {
  style?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

interface Fill {
  colors?: string[] | undefined;
  opacity?: number;
  type?: "solid" | "gradient" | "image" | "pattern";
  gradient?: Gradient;
  image?: Image;
  pattern?: Pattern;
}
interface ForecastDataPoints {
  count?: number;
  fillOpacity?: number;
  strokeWidth?: number; // You can specify the type more narrowly if needed
  dashArray?: number; // You can specify the type more narrowly if needed
}
interface Grid {
  show?: boolean;
  borderColor?: string;
  strokeDashArray?: number;
  position?: "front" | "back";
  xaxis?: {
    lines?: {
      show?: boolean;
    };
  };
  yaxis?: {
    lines?: {
      show?: boolean;
    };
  };
  row?: {
    colors?: string[]; // or a specific type if known
    opacity?: number;
  };
  column?: {
    colors?: string[]; // or a specific type if known
    opacity?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
interface Legend {
  show?: boolean;
  showForSingleSeries?: boolean;
  showForNullSeries?: boolean;
  showForZeroSeries?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "floating";
  horizontalAlign?: "left" | "center" | "right";
  floating?: boolean;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number;
  formatter?: (seriesName: string, opts: any) => string | undefined;
  inverseOrder?: boolean;
  width?: number;
  height?: number;
  tooltipHoverFormatter?: (seriesName: string, opts: any) => string | undefined;
  customLegendItems?: any[]; // Adjust type based on your use case
  offsetX?: number;
  offsetY?: number;
  labels?: {
    colors?: string[]; // or a specific type if known
    useSeriesColors?: boolean;
  };
  markers?: {
    size?: number;
    shape?: string; // e.g., 'circle', 'square', etc.
    strokeWidth?: number;
    fillColors?: string[]; // or a specific type if known
    customHTML?: string;
    onClick?: () => void; // Define based on your click handler requirements
    offsetX?: number;
    offsetY?: number;
  };
  itemMargin?: {
    horizontal?: number;
    vertical?: number;
  };
  onItemClick?: {
    toggleDataSeries?: boolean;
  };
  onItemHover?: {
    highlightDataSeries?: boolean;
  };
}
interface Markers {
  size?: number;
  colors?: string[] | string; // or a specific type if known
  strokeColors?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDashArray?: number;
  fillOpacity?: number;
  discrete?: any[]; // Adjust type based on your use case
  shape?: "circle" | "square" | "triangle" | "diamond"; // Add other shapes as necessary
  offsetX?: number;
  offsetY?: number;
  onClick?: () => void; // Define based on your click handler requirements
  onDblClick?: () => void; // Define based on your double-click handler requirements
  showNullDataPoints?: boolean;
  hover?: {
    size?: number;
    sizeOffset?: number;
  };
}
interface NoData {
  text?: string; // Text to display when there's no data
  align?: "left" | "center" | "right"; // Alignment of the text
  verticalAlign?: "top" | "middle" | "bottom"; // Vertical alignment of the text
  offsetX?: number; // Horizontal offset for positioning
  offsetY?: number; // Vertical offset for positioning
  style?: {
    color?: string; // Text color
    fontSize?: string; // Font size (e.g., '14px')
    fontFamily?: string; // Font family (e.g., 'Helvetica, Arial')
  };
}
interface ResponsiveOption {
  breakpoint?: number; // The viewport width at which the options apply
  options?: { [key: string]: any }; // Additional options that apply at this breakpoint
}

interface SeriesData {
  name: string; // Name of the series
  data: number[]; // Data points for the series
  type?: "line" | "area" | "column"; // Optional type for combo charts
  color?: string; // Optional color for the series
  hidden?: boolean; // Optional to hide series initially
  group?: string; // Optional group name for grouped stacked charts
  zIndex?: number; // Optional z-index for line and area charts
}
interface StateFilter {
  type?: "none" | "lighten" | "darken"; // Type of filter applied
  value?: number; // Value associated with the filter
}

interface StateConfig {
  filter?: StateFilter; // Filter settings for the state
  allowMultipleDataPointsSelection?: boolean; // Allows multiple selections in active state
}

interface ChartStates {
  normal?: StateConfig; // Configuration for the normal state
  hover?: StateConfig; // Configuration for the hover state
  active?: StateConfig; // Configuration for the active state
}
interface StrokeConfig {
  show?: boolean; // Indicates if the stroke should be shown
  curve?:
    | "straight"
    | "smooth"
    | "monotoneCubic"
    | "stepline"
    | ("straight" | "smooth" | "monotoneCubic" | "stepline")[]; // Type of curve for the stroke
  lineCap?: "butt" | "round" | "square"; // Style of the stroke's endpoints
  colors?: string[]; // Array of colors for the stroke
  width?: number; // Width of the stroke
  dashArray?: number; // Dash pattern for the stroke
}
interface SubtitleConfig {
  text?: string; // The text of the subtitle
  align?: "left" | "center" | "right"; // Alignment of the subtitle
  margin?: number; // Margin around the subtitle
  offsetX?: number; // Horizontal offset for positioning
  offsetY?: number; // Vertical offset for positioning
  floating?: boolean; // Whether the subtitle is floating
  style?: {
    fontSize?: string; // Font size of the subtitle
    fontWeight?: string; // Font weight of the subtitle
    fontFamily?: string; // Font family of the subtitle
    color?: string; // Color of the subtitle text
  };
}
interface ThemeConfig {
  mode?: "light" | "dark"; // Theme mode: light or dark
  palette?: string; // Color palette name
  monochrome?: {
    enabled?: boolean; // Whether monochrome is enabled
    color?: string; // Color to use for monochrome
    shadeTo?: "light" | "dark"; // Shade direction for the monochrome color
    shadeIntensity?: number; // Intensity of the shading
  };
}
interface TitleConfig {
  text?: string; // Title text
  align?: "left" | "center" | "right"; // Title alignment
  margin?: number; // Margin around the title
  offsetX?: number; // Horizontal offset
  offsetY?: number; // Vertical offset
  floating?: boolean; // Whether the title is floating
  style?: {
    fontSize?: string; // Font size of the title
    fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number; // Font weight
    fontFamily?: string; // Font family of the title
    color?: string; // Color of the title text
  };
}
interface TooltipConfig {
  enabled?: boolean; // Enables or disables the tooltip
  enabledOnSeries?: number[]; // Specifies series indices where the tooltip is enabled
  shared?: boolean; // Whether the tooltip shows shared data for multiple series
  followCursor?: boolean; // Whether the tooltip follows the cursor
  intersect?: boolean; // Whether the tooltip only shows when intersecting data points
  inverseOrder?: boolean; // Whether to reverse the order of tooltip items
  custom?: (data: any) => string | undefined; // Custom tooltip function
  hideEmptySeries?: boolean; // Whether to hide tooltips for empty series
  fillSeriesColor?: boolean; // Whether to fill the tooltip background with series color
  theme?: string | boolean; // Tooltip theme, can be a string or boolean
  style?: {
    fontSize?: string; // Font size for tooltip text
    fontFamily?: string; // Font family for tooltip text
  };
  onDatasetHover?: {
    highlightDataSeries?: boolean; // Highlights the data series on hover
  };
  x?: {
    show?: boolean; // Whether to show the x-axis value
    format?: string; // Date format for the x value
    formatter?: (value: any) => string | undefined; // Custom formatter for x value
  };
  y?: {
    formatter?: (value: number) => string; // Custom formatter for y value
    title?: {
      formatter?: (seriesName: string) => string; // Custom title formatter for y
    };
  };
  z?: {
    formatter?: (value: number) => string; // Custom formatter for z value
    title?: string; // Title for z value
  };
  marker?: {
    show?: boolean; // Whether to show the marker in the tooltip
  };
  items?: {
    display?: string; // Display property for tooltip items (e.g., 'flex')
  };
  fixed?: {
    enabled?: boolean; // Whether the tooltip is fixed in position
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft"; // Fixed position of the tooltip
    offsetX?: number; // Horizontal offset for the fixed tooltip
    offsetY?: number; // Vertical offset for the fixed tooltip
  };
}
interface XAxisConfig {
  type?: "category" | "datetime" | "numeric"; // Type of the x-axis
  categories?: string[]; // Categories for a category-type x-axis
  tickAmount?: number; // Number of ticks on the x-axis
  tickPlacement?: "between" | "on"; // Placement of ticks
  min?: number; // Minimum value for the x-axis
  max?: number; // Maximum value for the x-axis
  stepSize?: number; // Step size between ticks
  range?: number; // Range of the x-axis
  floating?: boolean; // If true, allows floating labels
  decimalsInFloat?: number; // Number of decimals in float values
  overwriteCategories?: string[]; // Override categories for x-axis
  position?: "top" | "bottom"; // Position of the x-axis
  labels?: {
    show?: boolean; // Whether to show labels
    rotate?: number; // Rotation angle for labels
    rotateAlways?: boolean; // If true, labels are always rotated
    hideOverlappingLabels?: boolean; // Hide overlapping labels
    showDuplicates?: boolean; // Show duplicate labels
    trim?: boolean; // Trim long labels
    minHeight?: number; // Minimum height for labels
    maxHeight?: number; // Maximum height for labels
    position?: "top" | "bottom";
    textAnchor?: string;
    style?: {
      colors?: string[]; // Colors for labels
      fontSize?: string; // Font size for labels
      fontFamily?: string; // Font family for labels
      fontWeight?: number; // Font weight for labels
      cssClass?: string; // CSS class for labels
    };
    offsetX?: number; // Horizontal offset for labels
    offsetY?: number; // Vertical offset for labels
    format?: string; // Format for labels
    formatter?: (value: any) => string; // Custom formatter for labels
    datetimeUTC?: boolean; // If true, treat datetime as UTC
    datetimeFormatter?: {
      year?: string; // Format for year
      month?: string; // Format for month
      day?: string; // Format for day
      hour?: string; // Format for hour
      minute?: string; // Format for minute
      second?: string; // Format for second
    };
  };
  group?: {
    groups?: string[]; // Group names for x-axis
    style?: {
      colors?: string[]; // Colors for group labels
      fontSize?: string; // Font size for group labels
      fontWeight?: number; // Font weight for group labels
      fontFamily?: string; // Font family for group labels
      cssClass?: string; // CSS class for group labels
    };
  };
  axisBorder?: {
    show?: boolean; // Whether to show the axis border
    color?: string; // Color of the axis border
    height?: number; // Height of the axis border
    width?: string; // Width of the axis border
    offsetX?: number; // Horizontal offset for the border
    offsetY?: number; // Vertical offset for the border
  };
  axisTicks?: {
    show?: boolean; // Whether to show the ticks
    borderType?: "solid" | "dashed" | "dotted"; // Type of the ticks
    color?: string; // Color of the ticks
    height?: number; // Height of the ticks
    offsetX?: number; // Horizontal offset for the ticks
    offsetY?: number; // Vertical offset for the ticks
  };
  title?: {
    text?: string; // Title text for the x-axis
    offsetX?: number; // Horizontal offset for the title
    offsetY?: number; // Vertical offset for the title
    style?: {
      color?: string; // Color for the title
      fontSize?: string; // Font size for the title
      fontFamily?: string; // Font family for the title
      fontWeight?: number; // Font weight for the title
      cssClass?: string; // CSS class for the title
    };
  };
  crosshairs?: {
    show?: boolean; // Whether to show crosshairs
    width?: number; // Width of the crosshair
    position?: "front" | "back"; // Position of the crosshair
    opacity?: number; // Opacity of the crosshair
    stroke?: {
      color?: string; // Color of the crosshair
      width?: number; // Width of the stroke
      dashArray?: number; // Dash array for dashed lines
    };
    fill?: {
      type?: "solid" | "gradient"; // Fill type for the crosshair
      color?: string; // Fill color
      gradient?: {
        colorFrom?: string; // Gradient start color
        colorTo?: string; // Gradient end color
        stops?: number[]; // Gradient stops
        opacityFrom?: number; // Opacity for the start color
        opacityTo?: number; // Opacity for the end color
      };
    };
    dropShadow?: {
      enabled?: boolean; // Whether to enable drop shadow
      top?: number; // Vertical offset for drop shadow
      left?: number; // Horizontal offset for drop shadow
      blur?: number; // Blur radius for drop shadow
      opacity?: number; // Opacity for drop shadow
    };
  };
  tooltip?: {
    enabled?: boolean; // Whether to show the tooltip
    formatter?: (value: any) => string; // Custom formatter for tooltip
    offsetY?: number; // Vertical offset for tooltip
    style?: {
      fontSize?: string; // Font size for tooltip text
      fontFamily?: string; // Font family for tooltip text
    };
  };
}
interface YAxisConfig {
  show?: boolean; // Whether to show the y-axis
  showAlways?: boolean; // If true, the y-axis is always shown
  showForNullSeries?: boolean; // Show axis for series with null data
  seriesName?: string; // Name of the series linked to the y-axis
  opposite?: boolean; // If true, place the y-axis on the opposite side
  reversed?: boolean; // If true, reverse the y-axis
  logarithmic?: boolean; // If true, use a logarithmic scale
  logBase?: number; // Base for the logarithmic scale
  tickAmount?: number; // Number of ticks on the y-axis
  min?: number; // Minimum value for the y-axis
  max?: number; // Maximum value for the y-axis
  stepSize?: number; // Step size between ticks
  forceNiceScale?: boolean; // If true, forces a "nice" scale
  floating?: boolean; // If true, allows floating labels
  decimalsInFloat?: number; // Number of decimals in float values
  labels?: {
    show?: boolean; // Whether to show labels
    align?: "left" | "right" | "center"; // Alignment of labels
    minWidth?: number; // Minimum width for labels
    maxWidth?: number; // Maximum width for labels
    style?: {
      colors?: string[]; // Colors for labels
      fontSize?: string; // Font size for labels
      fontFamily?: string; // Font family for labels
      fontWeight?: number; // Font weight for labels
      cssClass?: string; // CSS class for labels
    };
    offsetX?: number; // Horizontal offset for labels
    offsetY?: number; // Vertical offset for labels
    rotate?: number; // Rotation angle for labels
    formatter?: (value: number) => string; // Custom formatter for labels
  };
  axisBorder?: {
    show?: boolean; // Whether to show the axis border
    color?: string; // Color of the axis border
    offsetX?: number; // Horizontal offset for the border
    offsetY?: number; // Vertical offset for the border
  };
  axisTicks?: {
    show?: boolean; // Whether to show the ticks
    borderType?: "solid" | "dashed" | "dotted"; // Type of the ticks
    color?: string; // Color of the ticks
    width?: number; // Width of the ticks
    offsetX?: number; // Horizontal offset for the ticks
    offsetY?: number; // Vertical offset for the ticks
  };
  title?: {
    text?: string; // Title text for the y-axis
    rotate?: number; // Rotation angle for the title
    offsetX?: number; // Horizontal offset for the title
    offsetY?: number; // Vertical offset for the title
    style?: {
      color?: string; // Color for the title
      fontSize?: string; // Font size for the title
      fontFamily?: string; // Font family for the title
      fontWeight?: number; // Font weight for the title
      cssClass?: string; // CSS class for the title
    };
  };
  crosshairs?: {
    show?: boolean; // Whether to show crosshairs
    position?: "front" | "back"; // Position of the crosshair
    stroke?: {
      color?: string; // Color of the crosshair
      width?: number; // Width of the stroke
      dashArray?: number; // Dash array for dashed lines
    };
  };
  tooltip?: {
    enabled?: boolean; // Whether to show the tooltip
    offsetX?: number; // Horizontal offset for tooltip
  };
}

interface ChartOptions {
  type?: string; // e.g., "line", "bar", "pie"
  height?: number | string; // e.g., 300, "100%"
  width?: number | string; // e.g., 500, "100%"
  background: string;
  animateGradually?: {
    enabled?: boolean;
    delay?: number;
  };
  animations?: {
    enabled?: boolean;
    easing?: string;
    speed?: number;
    deceleration?: number;
    dynamicAnimation?: {
      enabled?: boolean;
      speed?: number;
    };
  };
  toolbar?: {
    show?: boolean;
    offsetX?: number;
    offsetY?: number;
    tools?: {
      download?: boolean;
      selection?: boolean;
      zoom?: boolean;
      zoomin?: boolean;
      zoomout?: boolean;
      pan?: boolean;
      reset?: boolean | string; // e.g., '<img src="/static/icons/reset.png" width="20">'
      customIcons?: Array<any>;
    };
    export?: {
      csv?: {
        filename?: string;
        columnDelimiter?: string;
        headerCategory?: string;
        headerValue?: string;
        categoryFormatter?: (x: any) => string;
        valueFormatter?: (y: any) => any;
      };
      svg?: {
        filename?: string;
      };
      png?: {
        filename?: string;
      };
    };
    autoSelected?: string; // e.g., 'zoom'
  };
  stacked?: boolean;
  stackType?: string; // e.g., 'normal', '100%'
  stackOnlyBar?: boolean;
  foreColor?: string; // Default text color
  dropShadow?: {
    enabled?: boolean;
    enabledOnSeries?: boolean;
    top?: number;
    left?: number;
    blur?: number;
    color?: string;
    opacity?: number;
  };
  brush?: {
    enabled?: boolean;
    target?: string; // e.g., "series-a"
    autoScaleYaxis?: boolean;
  };
  selection?: {
    enabled?: boolean;
    type?: string; // e.g., 'x', 'y', 'xy'
    fill?: {
      color?: string;
      opacity?: number;
    };
    stroke?: {
      width?: number;
      dashArray?: number;
      color?: string;
      opacity?: number;
    };
    xaxis?: {
      min?: number;
      max?: number;
    };
    yaxis?: {
      min?: number;
      max?: number;
    };
  };
  sparkline?: {
    enabled?: boolean;
  };
  zoom?: {
    enabled?: boolean;
    type?: string; // e.g., 'x', 'y', 'xy'
    autoScaleYaxis?: boolean;
    zoomedArea?: {
      fill?: {
        color?: string;
        opacity?: number;
      };
      stroke?: {
        color?: string;
        opacity?: number;
        width?: number;
      };
    };
  };
  events?: {
    animationEnd?: Function;
    beforeMount?: Function;
    mounted?: Function;
    updated?: Function;
    mouseMove?: Function;
    mouseLeave?: Function;
    click?: Function;
    legendClick?: Function;
    markerClick?: Function;
    xAxisLabelClick?: Function;
    selection?: Function;
    dataPointSelection?: Function;
    dataPointMouseEnter?: Function;
    dataPointMouseLeave?: Function;
    beforeZoom?: Function;
    beforeResetZoom?: Function;
    zoomed?: Function;
    scrolled?: Function;
  };
  fontFamily?: string; // e.g., 'Helvetica, Arial, sans-serif'
  group?: any; // Grouping information
  id?: string; // Unique identifier for the chart
  locales?: Array<{
    name: string;
    options: {
      months: string[];
      shortMonths: string[];
      days: string[];
      shortDays: string[];
      toolbar: {
        download: string;
        selection: string;
        selectionZoom: string;
        zoomIn: string;
        zoomOut: string;
        pan: string;
        reset: string;
      };
    };
  }>;
  defaultLocale?: string; // e.g., 'en'
  nonce?: string; // For CSP compliance
  offsetX?: number;
  offsetY?: number;
  parentHeightOffset?: number;
  redrawOnParentResize?: boolean;
  redrawOnWindowResize?: boolean;
}

// ..............................................//

export interface ChartConfigTypes {
  series?: SeriesData[];
  options: {
    chart: ChartOptions;
    labels?: string[] | string;
    colors?: string[] | string;
    annotation?: Annotation;
    dataLabels?: DataLabels;
    fill?: Fill;
    forecastDataPoints?: ForecastDataPoints;
    grid?: Grid;
    legends?: Legend;
    markers?: Markers;
    noData?: NoData;
    responsive?: ResponsiveOption[];
    states?: ChartStates;
    stroke?: StrokeConfig;
    title?: TitleConfig;
    subtitle?: SubtitleConfig;
    theme?: ThemeConfig;
    tooltip?: TooltipConfig;
    xaxis?: XAxisConfig;
    yaxis?: YAxisConfig;
  };
}

export interface Translations {
  en: {
    unit: string;
    tooltip: string;
    xaxisUnit: string;
    Month: string;
    Week: string;
    Day: string;
    show: string;
    January: string;
    February: string;
    March: string;
    April: string;
    May: string;
    June: string;
    July: string;
    August: string;
    September: string;
    October: string;
    November: string;
    December: string;
    All: string;
    comingsoon: string;
  };
  de: {
    unit: string;
    tooltip: string;
    xaxisUnit: string;
    Month: string;
    Week: string;
    Day: string;
    show: string;
    January: string;
    February: string;
    March: string;
    April: string;
    May: string;
    June: string;
    July: string;
    August: string;
    September: string;
    October: string;
    November: string;
    December: string;
    All: string;
    comingsoon: string;
  };
}

export interface ChartDataPoint {
  x?: number; // Timestamp in milliseconds
  y?: number;
  berlinTimestamp?: number; // Value (e.g., energy consumption)
}
