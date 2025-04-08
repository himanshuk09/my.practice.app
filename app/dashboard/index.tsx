import { View, FlatList, SafeAreaView, StatusBar } from "react-native";
import "nativewind";
import MenuCard from "@/components/MenuCard";
import React, { useLayoutEffect } from "react";
import { DashboardCardsList } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const Dashboard: React.FC = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();

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
					data={DashboardCardsList}
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
