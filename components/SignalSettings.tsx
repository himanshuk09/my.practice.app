import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
} from "react-native";
import { st } from "@/utils/Styles";
import { i18n } from "@/localization/config";
import NoData from "@/components/icons/NoData";
import StackHeader from "@/components/ui/StackHeader";
import React, { useEffect, useState } from "react";
import CustomSwitch from "@/components/CustomSwitch";
import { ChartLoaderPNG } from "@/components/Loader";
import PrimaryButton from "./ui/PrimaryButton";

const Card = ({ title, data }: { title: string; data: any }) => {
	return (
		<View className="bg-[#ebebeb]  p-3 my-1 " style={[st.boxShadow]}>
			<Text className="text-sm text-gray-800 font-normal mb-2">
				{title}
			</Text>
			<View className="space-y-2 flex-row justify-between">
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between">
						<Text className=" text-sm text-gray-600">
							{i18n.t("Low_Soft")}:
						</Text>
						<Text className="text-gray-500">{data.lowSoft}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("Low_Hard")}
						</Text>
						<Text className="text-gray-500">{data.lowHard}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("Negative")}:
						</Text>
						<Text className="text-gray-500">
							{i18n.t(data.negative)}
						</Text>
					</View>
				</View>
				<View className="flex-col w-[45%]">
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("High_Soft")}:
						</Text>
						<Text className="text-gray-500">{data.highSoft}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("High_Hard")}:
						</Text>
						<Text className="text-gray-500">{data.highHard}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className="text-sm text-gray-600">
							{i18n.t("Days")}:
						</Text>
						<Text className="text-gray-500">{data.days}</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export const SignalsTitleNotificationCard = ({
	title,
	isEnabled,
	setIsEnabled,
}: any) => {
	return (
		<View
			className="flex justify-between bg-white flex-row  m-1  h-20 px-3 pl-5  "
			style={[st.headerShadow, st.bottomShadow]}
		>
			<View className="justify-center items-center">
				<Text className="text-xl font-medium text-mainCardHeaderText">
					{title}
				</Text>
			</View>
			<View className="flex-row justify-center items-center">
				<Text className="  mr-2 text-md font-normal text-mainCardHeaderText ">
					{i18n.t("notifications")}
				</Text>
				<CustomSwitch
					isEnabled={isEnabled}
					setIsEnabled={setIsEnabled}
				/>
			</View>
		</View>
	);
};
const SignalSettings = ({
	cards,
	modalVisible,
	setModalVisible,
	signalDetail,
	isEnabled,
	setIsEnabled,
}: {
	cards: any[];
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	signalDetail: any;
	isEnabled: boolean;
	setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [loading, setLoadig] = useState<any>(true);

	useEffect(() => {
		setTimeout(() => {
			setLoadig(false);
		}, 500);
	}, []);
	return (
		<View
			className={`h-full w-full absolute flex-1 bg-white `}
			style={StyleSheet.absoluteFill}
		>
			<StackHeader title={"Signals_Details"} closed={true} />
			<SignalsTitleNotificationCard
				title={signalDetail?.title}
				isEnabled={isEnabled}
				setIsEnabled={setIsEnabled}
			/>
			<View
				className="w-full h-full flex-1"
				style={{
					height: "100%",
				}}
			>
				{!cards || cards?.length === 0 ? (
					<NoData />
				) : loading ? (
					<ChartLoaderPNG />
				) : (
					<FlatList
						data={cards}
						renderItem={({ item, index }) => (
							<Card
								key={index}
								title={item.title}
								data={item.data}
							/>
						)}
						keyExtractor={(item: any, index) => index.toString()}
						scrollEnabled={true}
						className="bg-slate-50 overflow-scroll px-2"
						contentContainerStyle={{
							paddingTop: 1,
							backgroundColor: "#fff",
						}}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						initialNumToRender={10}
						maxToRenderPerBatch={5}
					/>
				)}

				<PrimaryButton
					title={"View_Signal_Chart"}
					onPress={() => setModalVisible(!modalVisible)}
					style={
						loading
							? "absolute bottom-0 left-0 right-0 mt-2"
							: "mt-2"
					}
				/>
			</View>
		</View>
	);
};

export default SignalSettings;
