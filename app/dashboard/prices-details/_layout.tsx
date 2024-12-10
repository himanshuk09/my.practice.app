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
        headerShown: false, // Hide headers for login-related pages
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
                  onPress={() => navigation.goBack()} // Handle back navigation
                  className="w-9"
                >
                  <MaterialIcons name="arrow-back" size={30} color="#1f2937" />
                </TouchableOpacity>
                <Text className="ml-4 font-bold text-xl text-gray-800">
                  Prices Details
                </Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
}
