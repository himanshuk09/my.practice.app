import "react-native-reanimated";
import React from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Logo from "@/components/SVG/Logo";
import { Link, Stack } from "expo-router";
import { useDispatch } from "react-redux";
import { toggleDrawer } from "@/store/drawerSlice";

const DrawerHeader = React.memo(({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 1,
          height: 80,
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
            top: 10,
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
const DashboardLayout = () => {
  const dispatch = useDispatch();
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
          headerShown: true,
          animation: "slide_from_right",
          animationDuration: 4000,
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
          headerShown: true,
          animation: "slide_from_left",
          animationDuration: 500,
          header: ({ navigation }) => <DrawerHeader navigation={navigation} />,
        }}
      />
    </Stack>
  );
};

export default DashboardLayout;
