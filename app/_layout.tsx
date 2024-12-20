import React, { useEffect } from "react";
import RootLayout from "./RootLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppLoader from "./AppLoader";
import NavigationWatcher from "./NavigationWatcher";
import * as SplashScreen from "expo-splash-screen";
import Drawer from "@/components/Drawer";
import { Button, View, StyleSheet } from "react-native";
import { closeDrawer } from "@/store/drawerSlice";
import CustomDrawer from "@/components/CustomDrawer";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

const Layout = () => {
  useEffect(() => {
    let timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <Provider store={store}>
      <Drawer
        drawerWidth={250}
        content={
          <View style={styles.drawerContent}>
            <Button
              title="Close Drawer"
              onPress={() => store.dispatch(closeDrawer())}
            />
          </View>
        }
      />
      <NavigationWatcher>
        <AppLoader>
          <RootLayout />
        </AppLoader>
      </NavigationWatcher>
    </Provider>
  );
};

export default Layout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
