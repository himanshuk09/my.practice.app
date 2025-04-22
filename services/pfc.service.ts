import api, { formateByEnergyType } from "./api";

const getPFCList = async () => {
	try {
		const response = await api.get("/api/pfc/GetPriceForwardCurves");
		const formateData = formateByEnergyType(response.data);
		return formateData;
	} catch (error) {
		console.log(
			"Error while Fetching PFC List",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return { gas: [], strom: [] };
	}
};

export { getPFCList };
