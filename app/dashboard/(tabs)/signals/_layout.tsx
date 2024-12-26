import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";

const SignalsLayout = () => {
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
            <View className="bg-[#E5E4E2] px-4 items-center justify-start py-6 flex-row h-20">
              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => navigation.goBack());
                }}
                className="w-9"
              >
                <MaterialIcons name="arrow-back" size={30} color="#1f2937" />
              </TouchableOpacity>
              <Text className="ml-4 font-bold text-xl text-[#9b9b9b]">
                Signals Details
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
};
export default SignalsLayout;
