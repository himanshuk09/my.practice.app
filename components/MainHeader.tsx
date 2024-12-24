import { toggleDrawer } from "@/store/drawerSlice";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import Logo from "./SVG/Logo";

const Header = React.memo(({ navigation }: any) => {
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
export default Header;
