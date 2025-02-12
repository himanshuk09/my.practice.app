import api from "./api";

const getPortfolioList = async () => {
	const response = await api.get("/api/portfolio/GetPortfolioList");
	return response?.data;
};
function filterPortfolioDetails(response: any) {
	// Extract response lists safely
	const { ResponseMonthlyList, ResponseOpenCloseList } = response;

	// Extract values efficiently
	const areaChartData = ["Forward", "Swing", "Spot", "Closed"].map(
		(name) => ({
			name: name,
			data:
				ResponseMonthlyList?.[name]?.map(
					(item: any) => item.Value
				) || [],
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
				(
					(ResponseOpenCloseList[0].OpenLoad / totalLoad) *
					100
				).toFixed(2),
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
	};
}

const getPortfolioDetails = async (payload: any) => {
	const response = await api.post(
		"/api/portfolio/GetPortfolioOpenCloseByPortfolioId",
		{ PortfolioId: payload }
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
	const filteredPortfolioDetails = filterPortfolioDetails(response.data);
	console.log("response.data", filteredPortfolioDetails);
	return filteredPortfolioDetails;
};

export { getPortfolioList, getPortfolioDetails };
