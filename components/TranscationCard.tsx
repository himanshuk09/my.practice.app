import { cockpitChartData } from "@/constants/cockpitchart";
import { stringChartData } from "@/constants/stringChartData";
import { i18n } from "@/localization/localConfig";
import { st } from "@/utils/Styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, Platform, FlatList, TouchableOpacity } from "react-native";
import {
	saveCSVToFileWeb,
	saveCSVToFileString,
} from "./ConstantFunctions/saveCSVFile";
import { Text } from "react-native";

const Card = ({ title, data }: any) => {
	return (
		<View className="bg-cardBg rounded-lg p-3 my-1 " style={st.boxShadow}>
			<Text className="text-sm text-cardTextHeader font-medium mb-2">
				{title}
			</Text>
			<View className="space-y-2 flex-row justify-between">
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("Direction")}:
						</Text>
						<View className="items-start justify-start w-[30%]">
							<Text className="text-xs text-cardText">
								{data.direction}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("Amount")}:
						</Text>
						<View className="items-start justify-start w-[30%]">
							<Text className="text-xs  text-cardText">
								{data.amount}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-xs text-cardText w-[70%]">
							{i18n.t("Price")}:
						</Text>
						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{data.price}
							</Text>
						</View>
					</View>
				</View>
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between">
						<Text className="text-xs text-cardText">
							{i18n.t("Trader")}:
						</Text>

						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{data.trader}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("Date")}:
						</Text>

						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{data.date}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("State")}:
						</Text>
						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{data.state}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};
const Transactions = ({ cards, setModalVisible, modalVisible }: any) => {
	return (
		<View className="flex-1 pt-20 ">
			<View className="flex justify-between  bg-white flex-row    h-20 px-3 pl-5 shadow-2xl shadow-black ">
				<View className="justify-center items-start bg-white">
					<Text className="text-xl font-semibold  text-mainCardHeaderText">
						Strom 2024
					</Text>
					<Text className="text-md font-medium text-mainCardHeaderText">
						Trade Transaction
					</Text>
				</View>

				<View className="py-5 mr-5">
					<FontAwesome5
						name="file-download"
						size={30}
						color="#ef4444"
						onPress={() => {
							if (Platform.OS === "web") {
								saveCSVToFileWeb(cockpitChartData);
							} else {
								saveCSVToFileString(stringChartData);
							}
						}}
					/>
				</View>
			</View>
			{cards?.length === 0 ? (
				<View className="items-center justify-center h-full w-full">
					<Text>Data Not Available</Text>
				</View>
			) : (
				<FlatList
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					data={cards}
					renderItem={({ item, index }) => (
						<Card
							key={index}
							title={item.title}
							data={item}
						/>
					)}
					keyExtractor={(item: any, index) => index.toString()}
					nestedScrollEnabled={true}
					scrollEnabled={true}
					initialNumToRender={1}
					maxToRenderPerBatch={5}
					style={{ padding: 8, flex: 1 }}
					className="bg-slate-50 overflow-scroll  p-2"
				/>
			)}
			<TouchableOpacity
				className={`bg-[#e31836]  bottom-0 mx-2 mb-2 py-3 flex justify-center items-center rounded-sm absolute left-0 right-0  
						}`}
				onPress={() => setModalVisible(!modalVisible)}
			>
				<Text className="text-white text-center text-base font-medium uppercase">
					{i18n.t("View_Portfolio")}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const DataRow = ({
	label,
	value,
	unit,
}: {
	label: string;
	value: any;
	unit: string;
}) => (
	<View className="flex-row w-full">
		<Text className="text-chartText text-xs font-normal flex-1 text-right">
			{value ?? "N/A"}
		</Text>
		<Text className="text-chartText text-xs w-12 text-left ml-2">
			{unit}
		</Text>
	</View>
);
export const DataDisplay = ({ data, title }: { data: any; title: string }) => {
	if (!data) return null; // Prevents rendering if data is missing

	return (
		<View className="flex p-1 bg-white">
			<Text
				className={`${title === "Closed" ? "text-red-600" : "text-chartText"} text-sm font-bold`}
			>
				{title}
			</Text>
			<DataRow
				label="Price"
				value={data?.Price}
				unit={data?.PriceUnit}
			/>
			<DataRow label="Load" value={data?.Load} unit={data?.LoadUnit} />
			<DataRow
				label="Value"
				value={data?.Value}
				unit={data?.unit || "€/MWh"}
			/>
		</View>
	);
};

// Reusable Row Component

export default Transactions;
