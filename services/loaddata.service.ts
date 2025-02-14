import api, { formateByEnergyType } from "./api";

const getLoadDataList = async () => {
	try {
		const response = await api.get(`/api/loadData/getMeterChannelInfo`);
		return formateByEnergyType(response.data);
	} catch (error) {
		console.log("Error while Fetching LoadDataList", error);
	}
};
export { getLoadDataList };
