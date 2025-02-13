import api, { filterByEnergyType } from "./api";

const getPFCList = async () => {
	const response = await api.get("/api/pfc/GetPriceForwardCurves");
	const formateData = filterByEnergyType(response.data);

	return formateData;
};

export { getPFCList };
