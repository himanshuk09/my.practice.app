import { Stack } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { activeLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { i18n } from "@/languageKeys/i18nConfig";
export default function LoadDataDetailsLayout() {
  const dispatch = useDispatch();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <SafeAreaView
              className="flex-1 "
              style={{
                paddingTop:
                  Platform.OS === "android" ? StatusBar.currentHeight : 0,
              }}
            >
              <StatusBar />
              <View className="bg-[#E5E4E2] px-4 items-center justify-start py-6 flex-row h-20">
                <TouchableOpacity
                  onPress={() => {
                    dispatch(activeLoading());
                    setTimeout(() => navigation.goBack());
                  }}
                  className="w-9"
                >
                  <MaterialIcons name="arrow-back" size={30} color="#1f2937" />
                </TouchableOpacity>
                <Text className="ml-4 font-bold text-xl text-gray-800">
                  {i18n.t("Load_Data_Details")}
                </Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
}
