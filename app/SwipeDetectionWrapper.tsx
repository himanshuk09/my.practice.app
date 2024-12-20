import React, { useCallback, useEffect, useState } from "react";
import { View, PanResponder, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { toggleDrawer } from "@/store/drawerSlice";

const SwipeDetectionWrapper = ({ children }: any) => {
  const dispatch = useDispatch();
  let debounceTimeout: any = null; // To hold the timeout ID

  const debounceToggleDrawer = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to debounce the action
    debounceTimeout = setTimeout(() => {
      console.log("Left swipe detected!");
      dispatch(toggleDrawer());
    }, 300); // 300ms debounce
  };

  // Create a pan responder to handle gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true, // Let the responder handle the touch event
    onMoveShouldSetPanResponder: () => true, // Allow movement during gesture
    onPanResponderMove: (e, gestureState) => {
      // Detect swipe gesture from the left side && gestureState.dx < 100
      if (gestureState.moveX < 50) {
        debounceToggleDrawer();
      }
    },
    onPanResponderRelease: () => true,
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
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
