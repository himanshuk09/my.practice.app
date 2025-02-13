import api, { filterByEnergyType } from "./api";

const getLoadDataList = async () => {
	try {
		const response = await api.get(`/api/loadData/getMeterChannelInfo`);

		return filterByEnergyType(response.data);
	} catch (error) {}
};
export { getLoadDataList };
