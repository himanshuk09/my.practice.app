import { Stack } from "expo-router";

import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "vertical",
        contentStyle: { backgroundColor: "white" },
        statusBarAnimation: "slide",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "slide_from_left",
          animationDuration: 500,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 4000,
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 4000,
        }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
