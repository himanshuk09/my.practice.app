// Drawer.js
import { closeDrawer, openDrawer, toggleDrawer } from "@/store/drawerSlice";
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

const Drawer = ({ drawerWidth = 280 }: any) => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector((state: any) => state.drawer.isDrawerOpen);
  const translateX = React.useRef(new Animated.Value(-drawerWidth)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDrawerOpen ? 0 : -drawerWidth,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen]);

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };
  const startLoader = () => {
    dispatch(activeLoading());
  };
  let debounceTimeout: any = null;

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
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.moveX < 50 && gestureState.dx > 20 && !isDrawerOpen) {
        debounceToggleDrawer();
      }
      if (gestureState.dx < -20 && isDrawerOpen) {
        debounceCloseDrawer();
      }
    },
    onPanResponderRelease: () => true,
  });
  return (
    <>
      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} />
      {/* Drawer Content */}
      <Animated.View
        style={[
          styles.drawer,
          { width: drawerWidth, transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <CustomDrawer startLoader={startLoader} />
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
