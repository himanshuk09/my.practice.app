// app/login/_layout.tsx
import { Stack } from "expo-router";
const LoginLayout = () => {
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
                    animationTypeForReplace: "push",
                }}
            />
            <Stack.Screen
                name="forgotpassword"
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
};

export default LoginLayout;
