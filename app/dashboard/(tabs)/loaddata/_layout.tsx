import { i18n } from "@/languageKeys/i18nConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

const LoaddataLayout = () => {
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
        name="[id]"
        options={{
          headerShown: true,
          animation: "slide_from_left",
          header: ({ navigation }) => (
            <SafeAreaView className="flex-1 ">
              <StatusBar />
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
                  {i18n.t("Load_Data_Details")}
                </Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
};
export default LoaddataLayout;
