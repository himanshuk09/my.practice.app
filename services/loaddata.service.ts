import api from "./api";
import dayjs from "dayjs";
import { formateByEnergyType } from "./helper";
import { TimeFrame } from "@/types/chart.type";

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
	} catch (error: any) {
		console.log(
			"Error while Fetching LoadDataTS",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return {
			gas: [],
			strom: [],
			success: false,
			error: error.errorMessage,
		};
	}
};

/**
 * transformData
 * dd.m.yyyy hh:mm:ss  ---to--- mm/dd/yyyy hh:mm
 * @param input { ValueArray:[],DateTimeArray:[],[key: string]: any;}
 * @returns { ValueArray:[],DateTimeArray:[],[key: string]: any;, data:[x:string,y:number]}
 */

function transformData1(input: {
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

function transformData(input: {
	ValueArray: number[];
	DateTimeArray: string[];
	[key: string]: any;
}) {
	const data = input.ValueArray.reduce((acc: any[], y, i) => {
		if (y < 0) return acc;

		const dateStr = input.DateTimeArray[i];
		const parsed = dayjs(dateStr, "DD.MM.YYYY HH:mm:ss");

		if (!parsed.isValid()) return acc;

		const formatted = parsed.format("MM/DD/YYYY HH:mm"); // formatted without seconds
		acc.push({ x: formatted, y });

		return acc;
	}, []);

	return {
		...input,
		data,
	};
}

/**
 * Get Load Data TS (chart data)
 * @returns
 */
const getLoadDataTS = async (payload: EnergyDataRequest) => {
	try {
		const response = await api.post(`/api/loadData/getLoadDataTS`, {
			...payload,
		});

		const formatedData = transformData(response?.data);
		return formatedData;
	} catch (error: any) {
		console.log(
			"Error while Fetching LoadDataTS",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return { success: false, error: error.errorMessage };
	}
};
export { getLoadDataList, getLoadDataTS, EnergyDataRequest };
