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
          animationDuration: 5000,
          animationTypeForReplace: "push",
        }}
      />
      <Stack.Screen
        name="forgotpassword"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 5000,
        }}
      />
    </Stack>
  );
}
