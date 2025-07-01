import "nativewind";
import { useDispatch } from "react-redux";
import MenuCard from "@/components/MenuCard";
import React, { useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { FlatList, SafeAreaView } from "react-native";
import { inActiveLoading } from "@/store/navigationSlice";
import { dashboardMenuItems } from "@/utils/MenuItemlist";

const Dashboard: React.FC = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	return (
		<SafeAreaView className="flex-1 bg-white justify-center mt-6 items-center">
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
		</SafeAreaView>
	);
};
export default Dashboard;
