// Drawer.js
import { closeDrawer, openDrawer } from "@/store/drawerSlice";
import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
import CustomDrawer from "./CustomDrawer";

const Drawer = ({ drawerWidth = 280, content }: any) => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector((state: any) => state.drawer.isDrawerOpen);
  const translateX = React.useRef(new Animated.Value(-drawerWidth)).current;
  // Gesture handler to detect swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only handle gestures starting from the left edge
        return gestureState.moveX < 30 && !isDrawerOpen;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update drawer position during swipe
        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx - drawerWidth, 0));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Open the drawer if the swipe is sufficient
        if (gestureState.dx > 50) {
          dispatch(openDrawer());
        } else {
          Animated.timing(translateX, {
            toValue: -drawerWidth,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDrawerOpen ? 0 : -drawerWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen]);

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };
  const startLoader = () => {
    dispatch(activeLoading());
  };
  return (
    <>
      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} />
      {/* Drawer Content */}
      <Animated.View
        style={[
          styles.drawer,
          { width: drawerWidth, transform: [{ translateX }] },
        ]}
        // {...panResponder.panHandlers}
      >
        {content}
        {/* <CustomDrawer startLoader={startLoader} /> */}
      </Animated.View>

      {/* Overlay */}
      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={handleCloseDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 100,
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 99,
  },
});

export default Drawer;
