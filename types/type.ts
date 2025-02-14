//LOAD DATA List
interface Channel {
	ChannelId: number;
	ChanelName: string;
	MeteringPoint: string;
	UnitId: number;
	energyType: number;
	ApiName: string | null;
	MeterId: number;
	// Allow additional properties
	[key: string]: any;
}

interface Meter {
	MeterId: number;
	MeterName: string;
	Street: string;
	City: string;
	ClientId: number;
	TimeZoneId: number;
	EnergyType: number;
	Unit: string;
	StartDate: string | null;
	EndDate: string | null;
	StartDateTick: number;
	EndateTick: number;
	MeterType: number;
	ChannelList: Channel[];
	// Allow additional properties
	[key: string]: any;
}

type MeterArray = Meter[];

//PFC List
interface PriceForwardCurve {
	PriceForwardCurveId: number;
	EnergyType: number;
	PriceForwardCurveDescription: string;
	TimeSeriesId: number;
	IsPFCTsAvailable: boolean;
	PriceForwardCurveName: string;
	StartDate: string | null;
	EndDate: string | null;
	Unit: string;
	// Allow additional properties
	[key: string]: any;
}

type PriceForwardCurveArray = PriceForwardCurve[];
//PORTFOLIO List
interface DaylightTransition {
	TimeOfDay: string;
	Month: number;
	Week: number;
	Day: number;
	DayOfWeek: number;
	IsFixedDateRule: boolean;
	// Allow additional properties
	[key: string]: any;
}

interface AdjustmentRule {
	DateStart: string;
	DateEnd: string;
	DaylightDelta: string;
	DaylightTransitionStart: DaylightTransition;
	DaylightTransitionEnd: DaylightTransition;
	BaseUtcOffsetDelta: string;
	// Allow additional properties
	[key: string]: any;
}

interface TimeZoneInfo {
	Id: string;
	DisplayName: string;
	StandardName: string;
	DaylightName: string;
	BaseUtcOffset: string;
	AdjustmentRules: AdjustmentRule[];
	SupportsDaylightSavingTime: boolean;
	// Allow additional properties
	[key: string]: any;
}

interface Portfolioprops {
	PortfolioId: number;
	EnergyType: number;
	PortfolioName: string;
	DeliveryFromTick: number;
	DeliveryUntilTick: number;
	PortfolioDate: string;
	SubPortfolioList: Portfolioprops[]; // Assuming it's an array of nested portfolios
	TimeFrame: number;
	IsExport: boolean;
	StartTick: number;
	EndTick: number;
	StartDate: string | null;
	EndDate: string | null;
	TZI: TimeZoneInfo;
	SpanStartDate: string;
	SpanEndDate: string;
	SpanStartTick: number;
	SpanEndTick: number;
	// Allow additional properties
	[key: string]: any;
}

type PortfolioArray = Portfolioprops[];
//PORTFOLIO Details
interface PortfolioOpenClose {
	PortfolioOpenCloseId: number;
	PortfolioId: number;
	DealType: number;
	ClosePrice: number;
	CloseLoad: number;
	CloseValue: number;
	OpenPrice: number;
	OpenLoad: number;
	OpenValue: number;
	PriceUnit: string;
	LoadUnit: string;
	// Allow additional properties
	[key: string]: any;
}

interface PortfolioTs {
	PortfolioTsId: number;
	PortfolioId: number;
	TSType: number;
	Value: number;
	// Allow additional properties
	[key: string]: any;
}

interface ResponseMonthlyList {
	Forward: PortfolioTs[];
	Swing: PortfolioTs[];
	Spot: PortfolioTs[];
	Closed: PortfolioTs[];
}

interface PortfolioDetailsResponse {
	ResponseOpenCloseList: PortfolioOpenClose[];
	ResponseMonthlyList: ResponseMonthlyList;
	// Allow additional properties
	[key: string]: any;
}
// portfolio formated details
interface AreaChartData {
	name: "Forward" | "Swing" | "Spot" | "Closed";
	data: number[];
	// Allow additional properties
	[key: string]: any;
}

interface OpenCloseData {
	Price: number;
	Load: number;
	Value: number;
	PriceUnit: "€";
	LoadUnit: "MWh";
	unit: "€/MWh";
	// Allow additional properties
	[key: string]: any;
}

interface FormattedPortfolioDetails {
	areaChartData: AreaChartData[];
	donotChartData: number[]; // [openPercentage, closedPercentage]
	closedData: OpenCloseData[];
	openData: OpenCloseData[];
	message?: string;
	// Allow additional properties
	[key: string]: any;
}
interface PortfolioDetailsError {
	message: string;
	closedData: OpenCloseData[];
	openData: OpenCloseData[];
	// Allow additional properties
	[key: string]: any;
}
//POrtfolio Deals
interface TradeDetail {
	PortfolioId: number;
	ProductName: string;
	Direction: boolean;
	Amount: number;
	Price: number;
	Trader: string;
	Date: string; // Consider using Date type if parsing is needed
	State: boolean;
	DerivativesMarket: string;
	IsPercentage: boolean;
	CounterParty: string;
	Release: string | null;
	EuroPerMW: number;
	Time: string;
	ShortCountertPartyName: string;
	// Allow additional properties
	[key: string]: any;
}

// Array of TradeDetail objects
type TradeDetailsArray = TradeDetail[];

export {
	MeterArray,
	PriceForwardCurveArray,
	PortfolioArray,
	Portfolioprops,
	PortfolioDetailsResponse,
	FormattedPortfolioDetails,
	PortfolioDetailsError,
	TradeDetailsArray,
};
