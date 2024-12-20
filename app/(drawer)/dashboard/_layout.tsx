import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import React from "react";
import { Drawer } from "expo-router/drawer";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import CustomDrawer from "@/components/CustomDrawer";
import Logo from "@/components/SVG/Logo";
import { Link, Stack, usePathname } from "expo-router";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { toggleDrawer } from "@/store/drawerSlice";
const DrawerHeader = React.memo(({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 1,
          height: 100,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          elevation: 0,
          shadowColor: "transparent",
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 0 },
          borderBottomWidth: 0,
        }}
      >
        <TouchableOpacity
          onPress={() => dispatch(toggleDrawer())}
          style={{
            position: "absolute",
            left: 10,
            top: 0,
          }}
        >
          <Entypo name="menu" size={30} color="gray" />
        </TouchableOpacity>
        <Link href={"/dashboard"}>
          <Logo />
        </Link>
      </View>
    </SafeAreaView>
  );
});
const DashboardLayout = () => (
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
        headerShown: true,
        animation: "slide_from_left",
        animationDuration: 500,
        header: ({ navigation }) => <DrawerHeader navigation={navigation} />,
      }}
    />
    <Stack.Screen
      name="(top-tabs)"
      options={{
        headerShown: true,
        animation: "slide_from_right",
        animationDuration: 500,
        header: ({ navigation }) => <DrawerHeader navigation={navigation} />,
      }}
    />
    <Stack.Screen
      name="settings"
      options={{
        headerShown: false,
        animation: "slide_from_left",
        animationDuration: 500,
        header: ({ navigation }) => <DrawerHeader navigation={navigation} />,
      }}
    />
  </Stack>
);

export default DashboardLayout;
