import { Entypo } from "@expo/vector-icons";
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
export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="prices-setting"
        options={{
          headerShown: true,
          title: "Settings Prices",
          headerBackButtonDisplayMode: "minimal",
          headerBackVisible: true,
          // Header styling
          headerStyle: {
            backgroundColor: "gray", // Header background color
          },
          headerTintColor: "#fff", // Text and back button color (white text)

          headerBackButtonMenuEnabled: true, // Enable back button menu if needed
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
                  onPress={() => navigation.goBack()} // Handle back navigation
                  className="w-9"
                >
                  <MaterialIcons name="arrow-back" size={30} color="#1f2937" />
                </TouchableOpacity>
                <Text className="ml-4 font-bold text-xl text-gray-800">
                  Prices Setting
                </Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
}
