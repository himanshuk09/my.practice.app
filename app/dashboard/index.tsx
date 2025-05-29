import "nativewind";
import { useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import MenuCard from "@/components/MenuCard";
import React, { useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { dashboardMenuItems } from "@/utils/MenuItemlist";
import { View, FlatList, SafeAreaView } from "react-native";

const Dashboard: React.FC = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);
	console.log("testing");

	return (
		<SafeAreaView className="flex-1 bg-white">
			<StatusBar
				style="light"
				translucent
				animated
				hideTransitionAnimation="fade"
				networkActivityIndicatorVisible
			/>
			<View className="justify-center mt-6 items-center">
				<FlatList
					data={dashboardMenuItems}
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
