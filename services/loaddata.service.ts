import api from "./api";
import { formateByEnergyType } from "./helper";

/**
 *
 * Types
 *
 */
var graphPriceUnit = [
	" €/MWh",
	" €/MWh",
	" €/MWh",
	" US$/ton",
	" €/ton",
	" TL/MWh",
];
var currencySymbol = [" €", " €", " €", " US$", " €", " TL"];
var timeFrameText = [
	"Day",
	"Week",
	"Month",
	"Quarter",
	"Year",
	"ThreeYear",
	"Custom",
];

type TimeFrameString =
	| "day"
	| "Week"
	| "Month"
	| "Quarter"
	| "Year"
	| "ThreeYear"
	| "Custom";

type TimeFrame = TimeFrameString | 0 | 1 | 2 | 3 | 4 | 5 | 6;

type EnergyDataRequest = {
	ChannelId?: number;
	ClientId?: number;
	MeterId?: number;
	EnergyType?: number;
	UnitId?: number;
	MinValue?: number;
	MaxValue?: number;
	TimeFrame: TimeFrame;
	StartDateTick?: number;
	EndateTick?: number;
	StartDate?: string;
	EndDate?: string;
};

/**
 * Get Load Data List
 * @returns {gas: [], strom: []}
 */

const getLoadDataList = async () => {
	try {
		const response = await api.get(`/api/loadData/getMeterChannelInfo`);
		return formateByEnergyType(response.data);
	} catch (error) {
		console.log(
			"Error while Fetching LoadDataList",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return {
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

/**
 * transformData
 * dd.m.yyyy hh:mm:ss  ---to--- mm/dd/yyyy hh:mm
 * @param input { ValueArray:[],DateTimeArray:[],[key: string]: any;}
 * @returns { ValueArray:[],DateTimeArray:[],[key: string]: any;, data:[x:string,y:number]}
 */

function transformData(input: {
	ValueArray: number[];
	DateTimeArray: string[];
	[key: string]: any;
}) {
	const data = input.ValueArray.reduce((acc: any, y, i) => {
		if (y < 0) {
			return acc; // skip this iteration
		}
		// Split the date and time parts
		const [datePart, timePart] = input.DateTimeArray[i].split(" ");
		// Split the date into day, month, year
		const [day, month, year] = datePart.split(".");
		// Reformat the date to mm/dd/yyyy
		const formattedDate = `${month}/${day}/${year}`;
		// Remove seconds from time if present
		const timeParts = timePart.split(":");
		const formattedTime = `${timeParts[0]}:${timeParts[1]}`;
		const x = `${formattedDate} ${formattedTime}`;

		acc.push({ y, x });
		return acc;
	}, []);
	return {
		...input,
		data,
	};
}

/**
 * Get Load Data TS
 * @returns
 */
const getLoadDataTS = async (payload: EnergyDataRequest) => {
	try {
		const response = await api.post(`/api/loadData/getLoadDataTS`, {
			...payload,
		});
		const formatedData = transformData(response?.data);
		return formatedData;
	} catch (error) {
		console.log("Error while Fetching LoadDataTS", error);
	}
};
export { getLoadDataList, getLoadDataTS, EnergyDataRequest };
