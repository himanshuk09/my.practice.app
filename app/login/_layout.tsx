// app/login/_layout.tsx
import { Stack } from "expo-router";

export default function LoginLayout() {
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
          animationDuration: 4000,
        }}
      />
      <Stack.Screen
        name="forgotpassword"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 4000,
        }}
      />
    </Stack>
  );
}
