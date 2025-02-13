import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { i18n } from "@/localization/localConfig";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import RatingStars from "@/components/RatingStars";

const Rate = () => {
	const [ratingMsg, setRatingMsg] = useState("");
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();

	useEffect(() => {
		setTimeout(() => dispatch(inActiveLoading()), 100);
	}, [isFocused]);
	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: "white" }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#C3C3C3"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>

			{/* Header */}
			<View className="top-0 w-full z-50 p-3 bg-primary h-20">
				<Text className="text-xl font-semibold text-white capitalize">
					{i18n.t("rateus")}
				</Text>
			</View>

			{/* Main Content */}
			<ScrollView
				className="flex-1"
				contentContainerStyle={{
					padding: 15,
					justifyContent: "center",
					alignItems: "center",
				}}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="font-extrabold text-md text-slate-400 text-center mb-5">
					{i18n.t("how_is_your_experience_with_our_app_so_far")}
				</Text>

				<RatingStars maxStars={5} />
				{/* Feedback Input */}
				<View className="w-full p-2 relative">
					<TextInput
						className="pr-10 pl-3 py-3 bg-gray-200 border h-40 w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 focus:shadow-[#D8EAF9] focus:shadow-2xl rounded-lg text-lg align-top z-1"
						// placeholder={i18n.t("message")}
						value={ratingMsg}
						onChangeText={setRatingMsg}
						multiline={true}
						numberOfLines={6}
						style={{ paddingRight: 30 }}
					/>
					<FontAwesome
						style={{
							position: "absolute",
							right: 20,
							top: 20,
							zIndex: 100,
						}}
						name="pencil"
						size={20}
						color="#6b7280"
						className="z-50"
					/>
				</View>
			</ScrollView>

			{/* Footer Buttons */}
			<View className="w-full flex flex-row justify-evenly border-t-2 border-primary">
				<TouchableOpacity
					className="items-center p-5 w-[50%] bg-white"
					onPress={() => {
						router.back();
					}}
				>
					<Text className="text-center text-primary font-normal uppercase bg-white">
						{i18n.t("cancel")}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="items-center p-5 w-[50%] bg-primary"
					onPress={() => {
						alert("Thank you for your feedback!");
						router.push("/dashboard");
					}}
				>
					<Text className="text-center text-white uppercase font-normal">
						{i18n.t("save")}
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Rate;
