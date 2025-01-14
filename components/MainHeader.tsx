import { toggleDrawer } from "@/store/drawerSlice";
import { Entypo } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import Logo from "./SVG/Logo";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

const Header = React.memo(({ navigation }: any) => {
    const dispatch = useDispatch();
    const router = useRouter();
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
                    <Entypo name="menu" size={30} color="#9a9b9f" />
                </TouchableOpacity>
                {/* <Link href={"/dashboard"}>
                    <Logo />
                </Link> */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        setTimeout(() => {
                            router.push("/dashboard");
                        });
                        dispatch(activeLoading());
                        setTimeout(() => {
                            dispatch(inActiveLoading());
                        }, 2000);
                    }}
                >
                    <Logo />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
});
export default Header;
