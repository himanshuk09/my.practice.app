import { st } from "@/utils/Styles";
import { useEffect, useState } from "react";
import { i18n } from "@/localization/config";
import { useDebounce } from "@/hooks/useDebounce";
import StackHeader from "@/components/ui/StackHeader";
import { ChartLoaderPNG } from "@/components/Loader";
import {
	View,
	Text,
	FlatList,
	Platform,
	StyleSheet,
	RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import NoData from "./icons/NoData";
import {
	exportDealsToCSV,
	exportDealsToCSVWeb,
} from "@/components/exportcsv/exporttofile";
import PrimaryButton from "./ui/PrimaryButton";
import DownloadFIleIcon from "./ui/DownloadFIleIcon";
import { UNIT_PLACEHOLDER } from "@/utils/dateformatter.utils";

const Card = ({ title, deals }: { title: string; deals: any }) => {
	return (
		<View
			className="bg-cardBg  mx-2 p-3 my-1 "
			style={[st.boxShadow, { shadowColor: "#ccc" }]}
		>
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
								{deals?.Amount}{" "}
								{UNIT_PLACEHOLDER.PLACEHOLDER_MW}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-xs text-cardText w-[70%]">
							{i18n.t("Price")}:
						</Text>
						<View className="items-start justify-start w-[50%]">
							<Text className="text-xs text-cardText">
								{deals?.Price}{" "}
								{
									UNIT_PLACEHOLDER.PLACEHOLDER_EURO_PER_MEGAWATT_HOUR_UNIT
								}
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
const DataDisplay = ({
	data,
	title,
	locale,
}: {
	data: any;
	title: string;
	locale?: string;
}) => {
	// if (!data) return null; // Prevents rendering if data is missing

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
				unit={data?.PriceUnit || UNIT_PLACEHOLDER.PLACEHOLDER_EURO}
				locale={locale}
			/>
			<DataRow
				label="Load"
				value={data?.Load}
				unit={data?.LoadUnit || UNIT_PLACEHOLDER.PLACEHOLDER_KWH_UNIT}
				locale={locale}
			/>
			<DataRow
				label="Value"
				value={data?.Value}
				unit={
					data?.unit ||
					UNIT_PLACEHOLDER.PLACEHOLDER_EURO_PER_MEGAWATT_HOUR_UNIT
				}
				locale={locale}
			/>
		</View>
	);
};

const Transactions = ({
	cards,
	setModalVisible,
	modalVisible,
	title,
	onRefresh,
	isRefreshing,
}: {
	cards: any;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	modalVisible: boolean;
	title: string;
	onRefresh: () => void;
	isRefreshing: boolean;
}) => {
	const [loading, setLoadig] = useState<boolean>(true);
	const isOnline = useSelector(
		(state: RootState) => state?.network.isConnected
	);
	const [debouncedExport, showIcon] = useDebounce(() => {
		if (!isOnline || cards?.length === 0) return;
		setModalVisible(!modalVisible);
		Platform.OS === "web"
			? exportDealsToCSVWeb(cards, `${title}_deals.csv`)
			: exportDealsToCSV(cards, `${title}_deals.csv`);
	}, 1000);
	useEffect(() => {
		setTimeout(() => {
			setLoadig(false);
		}, 200);
	}, []);

	return (
		<View className="flex-1 bg-white " style={StyleSheet.absoluteFill}>
			<StackHeader title={"portfolio_overview"} closed={true} />
			<View
				className="flex justify-between  bg-white flex-row  mb-1  h-20 px-3 pl-5 "
				style={st.bottomShadow}
			>
				<View className="justify-center items-start bg-white">
					<Text className="text-xl font-semibold  text-mainCardHeaderText">
						{title}
					</Text>
					<Text className="text-md font-medium text-mainCardHeaderText">
						{i18n.t("Traded_Transaction")}
					</Text>
				</View>

				<View className="py-5 mr-5">
					<DownloadFIleIcon
						onPress={debouncedExport}
						showIcon={showIcon}
						size={25}
						height={25}
						width={24}
					/>
				</View>
			</View>
			<View className="flex-1  w-full h-full">
				{!cards || cards?.length === 0 ? (
					<NoData />
				) : loading ? (
					<ChartLoaderPNG />
				) : (
					<FlatList
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						data={cards}
						renderItem={({ item, index }) => (
							<Card key={index} title={item.title} deals={item} />
						)}
						keyExtractor={(item: any, index) => index.toString()}
						nestedScrollEnabled={true}
						scrollEnabled={true}
						initialNumToRender={10}
						maxToRenderPerBatch={10}
						style={{
							flex: 1,
							marginBottom: 5,
						}}
						contentContainerStyle={{
							backgroundColor: "#fff",
						}}
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={onRefresh}
								colors={["#9E9B9B"]} // Optional: Set colors for the refresh indicator
							/>
						}
					/>
				)}
			</View>
			<PrimaryButton
				title={"View_Portfolio"}
				onPress={() => setModalVisible(!modalVisible)}
				style={
					loading || cards?.length === 0
						? "absolute bottom-1 left-0 right-0 "
						: ""
				}
			/>
		</View>
	);
};

export default Transactions;
export { DataDisplay };
