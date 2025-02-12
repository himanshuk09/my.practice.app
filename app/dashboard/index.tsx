import { View, FlatList, SafeAreaView, StatusBar } from "react-native";
import "nativewind";
import MenuCard from "@/components/MenuCard";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { DashboardCardsEng } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
interface MenuItem {
	id: number;
	title: string;
	icon: string;
	notificationCount: number;
	route: any;
}
const Dashboard: React.FC = () => {
	const [jsonData, setJsonData] = useState<MenuItem[]>(DashboardCardsEng);
	const isFocused = useIsFocused();
	const dispatch = useDispatch();

	useEffect(() => {
		setJsonData(DashboardCardsEng);
	}, DashboardCardsEng);

	useLayoutEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);
	return (
		<SafeAreaView className="flex-1 bg-white">
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#C3C3C3"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			<View className="justify-center mt-6 items-center">
				<FlatList
					data={jsonData}
					keyExtractor={(item) => item?.id?.toString()}
					numColumns={2}
					renderItem={({ item, index }) => (
						<MenuCard item={item} index={index} />
					)}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flexGrow: 1 }}
				/>
			</View>
		</SafeAreaView>
	);
};
export default Dashboard;
