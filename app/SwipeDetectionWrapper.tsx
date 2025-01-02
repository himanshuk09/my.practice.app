import React, { useCallback, useEffect, useState } from "react";
import { View, PanResponder, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, toggleDrawer } from "@/store/drawerSlice";
import { usePathname, useRouter } from "expo-router";

const SwipeDetectionWrapper = ({ children }: any) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isLoginRoute =
    pathname === "/login" || pathname === "/login/forgotpassword";
  let debounceTimeout: any = null;
  const isDrawerOpen = useSelector((state: any) => state.drawer.isDrawerOpen);

  const debounceAction = (action: () => void) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(action, 300);
  };
  const debounceToggleDrawer = () => {
    debounceAction(() => {
      console.log("Left swipe detected!");
      dispatch(toggleDrawer());
    });
  };
  const debounceCloseDrawer = () => {
    debounceAction(() => {
      console.log("Right to left swipe detected, closing drawer!");
      dispatch(closeDrawer());
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true, // Let the responder handle the touch event
    onMoveShouldSetPanResponder: () => true, // Allow movement during gesture
    onPanResponderMove: (e, gestureState) => {
      // Detect swipe gesture from the left side to open the drawer
      if (gestureState.moveX < 50 && gestureState.dx > 20 && !isDrawerOpen) {
        debounceToggleDrawer();
      }
      // Detect swipe gesture from the right side to close the drawer
      if (gestureState.dx < -20 && isDrawerOpen) {
        debounceCloseDrawer();
      }
    },
    onPanResponderRelease: () => true,
  });
  return (
    <View
      style={styles.container}
      // {...panResponder.panHandlers}
      {...(!isLoginRoute ? panResponder.panHandlers : {})}
      className="font-sans"
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent", // Make it invisible
  },
});

export default SwipeDetectionWrapper;
