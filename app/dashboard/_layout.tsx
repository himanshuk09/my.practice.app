import React from "react";
import { Drawer } from "expo-router/drawer";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Entypo } from "@expo/vector-icons";
import CustomDrawer from "@/components/CustomDrawer";
// import Logo from "@/assets/svg/logo.svg";
import { Stack, usePathname } from "expo-router";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
const DashboardLayout = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const startLoader = () => {
    dispatch(activeLoading());
  };
  return (
    <>
      <Drawer
        screenOptions={{
          drawerType: "front",

          header: ({ navigation }) => (
            <SafeAreaView
              style={{
                // backgroundColor:
                //   pathname == "/dashboard/portfolios/portfolio-overview"
                //     ? "white"
                //     : "transparent",
                backgroundColor: "white",
                paddingTop: 40,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 5,
                  height: 60,
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
                  onPress={() => navigation.toggleDrawer()}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 2,
                  }}
                >
                  <Entypo name="menu" size={30} color="gray" />
                </TouchableOpacity>
                {/*  <Logo /> */}
              </View>
            </SafeAreaView>
          ),
          drawerLabelStyle: {
            fontSize: 20,
          },
          drawerStyle: {
            backgroundColor: "#f9f9f9",
            width: 280,
          },
        }}
        drawerContent={(props) => (
          <CustomDrawer {...props} startLoader={startLoader} />
        )}
      ></Drawer>
    </>
  );
};
export default DashboardLayout;
