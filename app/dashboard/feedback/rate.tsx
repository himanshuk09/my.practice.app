import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
// import StarRating from "react-native-star-rating-widget";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { i18n } from "@/languageKeys/i18nConfig";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const Rate = () => {
  const [rating, setRating] = useState(2.5);
  const [isRated, setIsRated] = useState(false);
  const [ratingMsg, setRatingMsg] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return { emoji: "😔", text: "poor", color: "text-red-500" };
      case 1.5:
        return { emoji: "😟", text: "below_average", color: "text-red-400" };
      case 2:
        return { emoji: "😕", text: "fair", color: "text-orange-500" };
      case 2.5:
        return {
          emoji: "😐",
          text: "almost_average",
          color: "text-orange-400",
        };
      case 3:
        return { emoji: "😐", text: "average", color: "text-yellow-500" };
      case 3.5:
        return { emoji: "🙂", text: "above_average", color: "text-yellow-400" };
      case 4:
        return { emoji: "🙃", text: "good", color: "text-green-500" };
      case 4.5:
        return { emoji: "😃", text: "very_good", color: "text-green-400" };
      case 5:
        return { emoji: "😍", text: "excellent", color: "text-blue-500" };
      default:
        return { emoji: "", text: "", color: "text-gray-500" };
    }
  };
  const { emoji, text, color } = getRatingText(rating);

  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar />

          {/* Header */}
          <View className="top-0 w-full z-50 p-3 bg-[#e31837] h-20">
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
            {isRated && color && emoji && text && (
              <Text
                className={`font-extrabold text-md ${color} text-center mb-1`}
              >
                {emoji} {i18n.t(text)}
              </Text>
            )}
            {/* Star Rating */}
            {/* <StarRating
              rating={rating}
              onChange={(newRating) => {
                setRating(newRating);
                setIsRated(true);
              }}
              starSize={36}
              color="#ff0000de"
              starStyle={{ marginVertical: 20 }}
            /> */}
            {/* Feedback Input */}
            <View className="w-full p-2 relative">
              <TextInput
                className="pr-10 pl-3 py-3 bg-gray-200 border h-40 w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 rounded-md text-lg align-top"
                placeholder={i18n.t("message")}
                value={ratingMsg}
                onChangeText={setRatingMsg}
                multiline={true}
                numberOfLines={6}
              />
              <FontAwesome
                style={{ position: "absolute", right: 20, top: 20 }}
                name="pencil"
                size={20}
                color="#6b7280"
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="w-full flex flex-row justify-evenly border-t-2 border-[#e31837]">
            <TouchableOpacity
              className="items-center p-5 w-[50%] bg-white"
              onPress={() => {
                router.back();
              }}
            >
              <Text className="text-center text-[#e31837] font-normal uppercase">
                {i18n.t("cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center p-5 w-[50%] bg-[#e31837]"
              onPress={() => {
                console.log("Rating Submitted:", { rating, ratingMsg });
                alert("Thank you for your feedback!");
                router.push("/dashboard");
              }}
            >
              <Text className="text-center text-white uppercase font-normal">
                {i18n.t("save")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Rate;
