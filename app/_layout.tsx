import React, { useEffect } from "react";
import RootLayout from "./RootLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppLoader from "./AppLoader";
import NavigationWatcher from "./NavigationWatcher";
import * as SplashScreen from "expo-splash-screen";
import Drawer from "@/components/Drawer";
import SwipeDetectionWrapper from "./SwipeDetectionWrapper";

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
      <Drawer drawerWidth={250} />
      <SwipeDetectionWrapper>
        <NavigationWatcher>
          <AppLoader>
            <RootLayout />
          </AppLoader>
        </NavigationWatcher>
      </SwipeDetectionWrapper>
    </Provider>
  );
};

export default Layout;
