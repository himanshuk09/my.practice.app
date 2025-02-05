import StackHeader from "@/components/StackHeader";
import { Stack } from "expo-router";
const PortfolioLayout = () => {
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
                    animation: "slide_from_right",
                    header: ({ navigation }) => (
                        <StackHeader
                            navigation={navigation}
                            title={"portfolio_overview"}
                        />
                    ),
                }}
            />
        </Stack>
    );
};

export default PortfolioLayout;
