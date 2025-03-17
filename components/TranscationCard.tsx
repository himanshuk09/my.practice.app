import { useEffect, useState } from "react";
import {
	View,
	Platform,
	FlatList,
	TouchableOpacity,
	Text,
	StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { i18n } from "@/localization/localConfig";
import { st } from "@/utils/Styles";
import { saveDealsCSV, saveDealsCSVWeb } from "./fileDownloaders/saveCSVFile";
import StackHeader from "./StackHeader";
import { ChartLoaderPNG } from "./Loader";
import useNetworkStatus from "@/hooks/useNetworkStatus";

const Card = ({ title, deals }: any) => {
	return (
		<View className="bg-cardBg  mx-1 p-3 my-1 " style={st.boxShadow}>
			<Text className="text-sm text-cardTextHeader font-medium mb-2">
				{deals?.ProductName}
			</Text>
			<View className="space-y-2 flex-row justify-between">
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("Direction")}:
						</Text>
						<View className="items-start justify-start w-[30%]">
							<Text className="text-xs text-cardText">
								{deals?.Direction ? "Buy" : "Sell"}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("Amount")}:
						</Text>
						<View className="items-start justify-start w-[30%]">
							<Text className="text-xs  text-cardText">
								{deals?.Amount} MW
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-xs text-cardText w-[70%]">
							{i18n.t("Price")}:
						</Text>
						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{deals?.Price} €/MWh
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
								{deals?.Trader}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("Date")}:
						</Text>

						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{deals?.Date}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between ">
						<Text className="text-xs text-cardText">
							{i18n.t("State")}:
						</Text>
						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{deals?.State ? "Confirmed" : "Pending"}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};
const Transactions = ({ cards, setModalVisible, modalVisible, title }: any) => {
	const [loading, setLoadig] = useState<any>(true);
	const isOnline = useNetworkStatus();
	useEffect(() => {
		setTimeout(() => {
			setLoadig(false);
		}, 1000);
	}, []);
	return (
		<View className="flex-1  " style={StyleSheet.absoluteFill}>
			<StackHeader
				title={"portfolio_overview"}
				closed={true}
				setModalVisible={setModalVisible}
			/>
			<View className="flex justify-between  bg-white flex-row    h-20 px-3 pl-5 shadow-lg shadow-cardBg ">
				<View className="justify-center items-start bg-white">
					<Text className="text-xl font-semibold  text-mainCardHeaderText">
						{title}
					</Text>
					<Text className="text-md font-medium text-mainCardHeaderText">
						Trade Transaction
					</Text>
				</View>

				<View className="py-5 mr-5">
					<FontAwesome5
						name="file-download"
						size={25}
						color="#ef4444"
						onPress={() => {
							if (!isOnline || cards?.length === 0) return;
							setModalVisible(!modalVisible);
							if (Platform.OS === "web") {
								saveDealsCSVWeb(
									cards,
									`${title}_deals.csv`
								);
							} else {
								saveDealsCSV(
									cards,
									`${title}_deals.csv`
								);
							}
						}}
					/>
				</View>
			</View>
			<View
				className="flex-1  w-full  "
				style={{
					height: "100%",
				}}
			>
				{cards?.length === 0 ? (
					<View
						className="items-center justify-center"
						style={{
							height: "91.5%",
						}}
					>
						<Text className="text-md font-medium text-mainCardHeaderText">
							Data Not Available
						</Text>
					</View>
				) : loading ? (
					<ChartLoaderPNG />
				) : (
					<FlatList
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						data={cards}
						renderItem={({ item, index }) => (
							<Card
								key={index}
								title={item.title}
								deals={item}
							/>
						)}
						keyExtractor={(item: any, index) =>
							index.toString()
						}
						nestedScrollEnabled={true}
						scrollEnabled={true}
						initialNumToRender={10}
						maxToRenderPerBatch={5}
						style={{
							flex: 1,
							marginBottom: 5,
						}}
					/>
				)}
				<TouchableOpacity
					className={`bg-primary  mx-2  py-3 flex justify-center items-center rounded-sm    
						${loading || cards?.length === 0 ? "absolute bottom-1 left-0 right-0 " : ""}}`}
					onPress={() => setModalVisible(!modalVisible)}
				>
					<Text className="text-white text-center text-base font-medium uppercase">
						{i18n.t("View_Portfolio")}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const DataRow = ({
	value,
	unit,
	locale,
}: {
	label?: string;
	value: any;
	unit: string;
	locale?: string;
}) => (
	<View className="flex-row w-full">
		<Text className="text-chartText text-xs font-normal flex-1 text-right">
			{value ? new Intl.NumberFormat(locale).format(value) : "0"}
		</Text>
		<Text className="text-chartText text-xs w-12 text-left ml-2">
			{unit}
		</Text>
	</View>
);
export const DataDisplay = ({
	data,
	title,
	locale,
}: {
	data: any;
	title: string;
	locale?: string;
}) => {
	if (!data) return null; // Prevents rendering if data is missing

	return (
		<View className="flex p-1 bg-white">
			<Text
				className={`${title === "Closed" ? "text-red-600" : "text-chartText"} mb-1 text-sm font-bold`}
			>
				{title}
			</Text>
			<DataRow
				label="Price"
				value={Math.trunc(data?.Price)}
				unit={data?.PriceUnit}
				locale={locale}
			/>
			<DataRow
				label="Load"
				value={data?.Load}
				unit={data?.LoadUnit}
				locale={locale}
			/>
			<DataRow
				label="Value"
				value={data?.Value}
				unit={data?.unit || "€/MWh"}
				locale={locale}
			/>
		</View>
	);
};

export default Transactions;
