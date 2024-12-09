import { Stack } from "expo-router";

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for login-related pages
      }}
    />
  );
}
