import React from "react";
import RootLayout from "./RootLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppLoader from "./AppLoader";
import NavigationWatcher from "./NavigationWatcher";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
// SplashScreen.hideAsync();
SplashScreen.setOptions({
  duration: 5000,
  fade: true,
});

const Layout = () => {
  return (
    <Provider store={store}>
      <NavigationWatcher>
        <AppLoader>
          <RootLayout />
        </AppLoader>
      </NavigationWatcher>
    </Provider>
  );
};

export default Layout;
