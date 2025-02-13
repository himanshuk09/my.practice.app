import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	ScrollView,
	RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { i18n } from "@/localization/localConfig";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
const imprintDetails = [
	"company",
	"address1",
	"address2",
	"phone",
	"fax",
	"mail",
	"web",
	"court",
	"hrb",
	"taxId",
	"directors",
	"responsibleContent",
	"liability",
];
const Imprint = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const onRefresh = async () => {
		setIsRefreshing(true);
		// Simulate a network request or refresh data logic
		setTimeout(() => {
			setIsRefreshing(false);
		}, 2000);
	};
	useEffect(() => {
		setTimeout(() => dispatch(inActiveLoading()), 100);
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
			<View className="top-0 w-full z-50 p-5 bg-primary h-24">
				<Text className="text-2xl font-normal text-white capitalize">
					{i18n.t("imprint")}
				</Text>
			</View>
			<ScrollView
				className="flex-1 px-5 mb-5"
				contentContainerStyle={{ flexGrow: 1 }}
				nestedScrollEnabled={true}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						colors={["#e31837"]}
					/>
				}
			>
				<View className="space-y-10 pl-4 pt-3">
					{imprintDetails.map((detail, index) => (
						<Text
							key={index}
							className="text-listText py-2 text-md font-normal"
						>
							{i18n.t(`imprints.${detail}`)}
						</Text>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Imprint;
// import {
//     View,
//     Text,
//     ActivityIndicator,
//     Pressable,
//     StyleSheet,
// } from "react-native";
// import React, {
//     useCallback,
//     useEffect,
//     useMemo,
//     useRef,
//     useState,
// } from "react";
// import api from "@/services/api";
// import { debounce } from "lodash";

// const Imprint = () => {
//     const [selectedPeriod, setSelectedPeriod] = useState("day");
//     const [chartData, setChartData] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const cache = useRef(new Map());
//     const getDateRange = (period: any) => {
//         const now = new Date();
//         const start = new Date();

//         switch (period) {
//             case "day":
//                 start.setHours(0, 0, 0, 0);
//                 break;
//             case "week":
//                 start.setDate(start.getDate() - start.getDay());
//                 break;
//             case "month":
//                 start.setDate(1);
//                 break;
//             case "year":
//                 start.setMonth(0, 1);
//                 break;
//             case "3year":
//                 start.setFullYear(start.getFullYear() - 3);
//                 break;
//         }

//         console.log(
//             "period",
//             period,
//             "start",
//             start.toISOString().split("T")[0],
//             "end",
//             now.toISOString().split("T")[0]
//         );

//         return {
//             start: start.toISOString().split("T")[0],
//             end: now.toISOString().split("T")[0],
//         };
//     };
//     const fetchData = useCallback(async (period: any) => {
//         if (cache.current.has(period)) {
//             setChartData(cache.current.get(period));
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const { start, end } = getDateRange(period);
//             // const response = await api.get(`/data?start=${start}&end=${end}`);

//             cache.current.set(period, 1);
//             console.log(cache);

//             // setChartData(response.data);
//         } catch (error) {
//             console.error("API Error:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     // Debounced version of fetchData
//     const debouncedFetch = useMemo(
//         () => debounce(fetchData, 300, { leading: false, trailing: true }),
//         [fetchData]
//     );
//     useEffect(() => {
//         debouncedFetch(selectedPeriod);
//         return () => debouncedFetch.cancel();
//     }, [selectedPeriod, debouncedFetch]);
//     const periods = ["day", "week", "month", "year", "3year"];

//     const PeriodToggle = React.memo(({ period, current, onPress }: any) => (
//         <Pressable
//             onPress={onPress}
//             style={[styles.toggle, current === period && styles.activeToggle]}
//         >
//             <Text
//                 style={
//                     current === period ? styles.activeText : styles.inactiveText
//                 }
//             >
//                 {period.toUpperCase()}
//             </Text>
//         </Pressable>
//     ));
//     return (
//         <View style={styles.container}>
//             <View style={styles.toggleContainer}>
//                 {periods.map((period) => (
//                     <PeriodToggle
//                         key={period}
//                         period={period}
//                         current={selectedPeriod}
//                         onPress={() => setSelectedPeriod(period)}
//                     />
//                 ))}
//             </View>

//             {isLoading ? (
//                 <ActivityIndicator size="large" />
//             ) : chartData ? (
//                 <Text> data available</Text>
//             ) : (
//                 <Text>No data available</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: "#F5FCFF",
//     },
//     toggleContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 20,
//         flexWrap: "wrap",
//         gap: 8,
//     },
//     toggle: {
//         flex: 1,
//         minWidth: 80,
//         maxWidth: 100,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: "#E0E0E0",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#FFFFFF",
//     },
//     activeToggle: {
//         backgroundColor: "#2196F3",
//         borderColor: "#1976D2",
//     },
//     activeText: {
//         color: "#FFFFFF",
//         fontWeight: "600",
//         fontSize: 14,
//     },
//     inactiveText: {
//         color: "#757575",
//         fontWeight: "500",
//         fontSize: 14,
//     },
//     chartContainer: {
//         borderRadius: 12,
//         padding: 16,
//         backgroundColor: "#FFFFFF",
//         elevation: 2,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     errorText: {
//         color: "#D32F2F",
//         textAlign: "center",
//         marginTop: 16,
//     },
// });

// export default Imprint;
