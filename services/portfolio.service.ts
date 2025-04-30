import api from "./api";
import { formateByEnergyType } from "./helper";
/**
 * GET PORTFOLIO LIST
 * @returns { gas: [], strom: [] };
 */
const getPortfolioList = async () => {
	try {
		const response = await api.get("/api/portfolio/GetPortfolioList");
		return formateByEnergyType(response.data);
	} catch (error) {
		console.log(
			"Error while Fetching PortfolioList",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return { gas: [], strom: [] };
	}
};

/**
 * FORMATE PORTFOLIO DETAILS
 * @param response 
 * @returns areaChartData,
		    donotChartData: [openPercentage, closedPercentage],
		    closedData: formattedData.map((d: any) => ({
                ...d.Close,
                PriceUnit: "€",
                LoadUnit: "MWh",
                unit: "€/MWh",
            })),
            openData: formattedData.map((d: any) => ({
                ...d.Open,
                PriceUnit: "€",
                LoadUnit: "MWh",
                unit: "€/MWh",
            })),
            message: "no error",
 */
const formatePortfolioDetails = (response: any) => {
	// Extract response lists safely
	const { ResponseMonthlyList, ResponseOpenCloseList } = response;

	// Extract values efficiently
	const areaChartData = ["Forward", "Swing", "Spot", "Closed"].map(
		(name) => ({
			name: name,
			data:
				ResponseMonthlyList?.[name]?.map((item: any) => item.Value) ||
				[],
		})
	);

	// Process open/close data
	const formattedData =
		ResponseOpenCloseList?.map((item: any) => ({
			Close: {
				Price: item.ClosePrice,
				Load: item.CloseLoad,
				Value: item.CloseValue,
			},
			Open: {
				Price: item.OpenPrice,
				Load: item.OpenLoad,
				Value: item.OpenValue,
			},
		})) || [];

	// Compute total load and percentages
	const totalLoad =
		(ResponseOpenCloseList?.[0]?.OpenLoad || 0) +
		(ResponseOpenCloseList?.[0]?.CloseLoad || 0);
	const [openPercentage, closedPercentage] = totalLoad
		? [
				((ResponseOpenCloseList[0].OpenLoad / totalLoad) * 100).toFixed(
					2
				),
				(
					(ResponseOpenCloseList[0].CloseLoad / totalLoad) *
					100
				).toFixed(2),
			].map(parseFloat)
		: [0, 0];

	// Return optimized structure
	return {
		areaChartData,
		donotChartData: [openPercentage, closedPercentage],
		closedData: formattedData.map((d: any) => ({
			...d.Close,
			PriceUnit: "€",
			LoadUnit: "MWh",
			unit: "€/MWh",
		})),
		openData: formattedData.map((d: any) => ({
			...d.Open,
			PriceUnit: "€",
			LoadUnit: "MWh",
			unit: "€/MWh",
		})),
		message: "no error",
	};
};

/**
 * GET PORTFOLIO DETAILS
 * @param payload
 * @returns
 */
const getPortfolioDetails = async (payload: any) => {
	try {
		const response = await api.post(
			"/api/portfolio/GetPortfolioOpenCloseByPortfolioId",
			{ ...payload }
		);
		if (response?.data?.ResponseOpenCloseList?.length === 0) {
			return {
				message: "no data",
				closedData: [
					{
						Price: 0,
						Load: 0,
						Value: 0,
						PriceUnit: "€",
						LoadUnit: "MWh",
						unit: "€/MWh",
					},
				],
				openData: [
					{
						Price: 0,
						Load: 0,
						Value: 0,
						PriceUnit: "€",
						LoadUnit: "MWh",
						unit: "€/MWh",
					},
				],
			};
		}
		const filteredPortfolioDetails = formatePortfolioDetails(response.data);
		return filteredPortfolioDetails;
	} catch (error) {
		console.log(
			"Error while Fetching PortfolioDetails",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
	}
};

/**
 * GET PORTFOLIO DEALS
 * @param payload
 * @returns
 */
const getPortfolioDeals = async (payload: any) => {
	try {
		const response: any = await api.post(
			"/api/portfolio/GetPortfolioDealsDetailsByPortfolioId",
			{ ...payload }
		);
		return response.data;
	} catch (error) {
		console.log(
			"Error while Fetching PortfolioDeals",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
	}
};

/**
 * GET PORTFOLIO REPORT BASE 64 PDF
 * @param payload
 * @returns
 */
const getPortfolioReportBase64PDF = async (payload: any) => {
	try {
		const response = await api.post(
			`/api/portfolio/ExportPortfolioByteReportById`,
			{ ...payload }
		);

		return response.data;
	} catch (error) {
		console.log(
			"Error while Fetching PortfolioReport",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
	}
};

/**
 * EXPORTS
 */
export {
	getPortfolioList,
	getPortfolioDetails,
	getPortfolioDeals,
	getPortfolioReportBase64PDF,
};
