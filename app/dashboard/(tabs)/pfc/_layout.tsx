import { Stack } from "expo-router";
const PFCLayout = () => {
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
export default PFCLayout;
