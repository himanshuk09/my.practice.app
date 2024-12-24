import { Stack } from "expo-router";

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
    </Stack>
  );
};
export default SignalsLayout;
