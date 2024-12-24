import { i18n } from "@/languageKeys/i18nConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
const PortfolioLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "slide_from_left" }}
      />
      <Stack.Screen
        name="portfolio-overview"
        options={{
          headerShown: true,
          animation: "slide_from_left",
          header: ({ navigation }) => (
            <View className="bg-[#ebebeb] px-4 items-center justify-start py-6 flex-row h-20">
              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => navigation.goBack());
                }}
                className="w-9"
              >
                <MaterialIcons name="arrow-back" size={30} color="#1f2937" />
              </TouchableOpacity>
              <Text className="ml-4 font-bold text-xl text-[#9b9b9b]">
                {i18n.t("portfolio_overview")}
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
};

export default PortfolioLayout;
