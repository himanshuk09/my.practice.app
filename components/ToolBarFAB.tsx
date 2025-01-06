import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"; // For icons
import { useState } from "react";

export default function FloatingActionMenu({ webViewRef }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  const [tooltip, setTooltip] = useState(false);
  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();

    setIsMenuOpen(!isMenuOpen);
  };

  const menuOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Slide menu items into view from right to left
  });

  const menuItems = [
    {
      icon: isZoomIn ? "search-plus" : "search-minus",
      action: "toggleZoomAndSelection()",
      size: 14,
      color: "#848484",
    },
    {
      icon: "plus-circle",
      action: "zoomIn()",
      size: 14,
      color: "#848484",
    },
    {
      icon: "minus-circle",
      action: "zoomOut()",
      size: 14,
      color: "#848484",
    },
    {
      icon: "home",
      action: "resetZoom()",
      size: 14,
      color: "#848484",
    },
    {
      icon: "hand-point-left",
      action: "customPanLeft()",
      size: 14,
      color: "#848484",
    },
    {
      icon: "hand-point-right",
      action: "customPanRight()",
      size: 14,
      color: "#848484",
    },

    {
      icon: tooltip ? "circle" : "dot-circle",
      action: `toggleMarkers()`,
      size: 14,
      color: "#848484",
    },
    {
      icon: "download",
      action: `exportChart()`,
      size: 14,
      color: "#848484",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item, index) => (
          <View style={styles.menuItem} key={index}>
            <TouchableOpacity
              style={styles.menuIcon}
              onPress={() => {
                (webViewRef?.current as any)?.injectJavaScript(item.action);
                console.log("menuItems");

                if (item.action === `toggleMarkers()`) {
                  setTooltip(!tooltip);
                }
                if (item.action === `toggleZoomAndSelection()`) {
                  setIsZoomIn(!isZoomIn);
                }
              }}
            >
              <FontAwesome5
                name={item.icon}
                size={item.size}
                color={item.color}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <MaterialIcons
          name={isMenuOpen ? "close" : "add"}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {/* Menu Items */}
      {isMenuOpen && (
        <Animated.View
          style={[
            styles.menuItemsContainer,
            {
              opacity: menuOpacity,
              transform: [{ translateX: menuTranslateX }],
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <View style={styles.menuItem} key={index}>
              <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => {
                  // Dynamically inject JavaScript based on the action in the JSON
                  (webViewRef?.current as any)?.injectJavaScript(item.action);
                  if (item.action === `toggleMarkers()`) {
                    setTooltip(!tooltip);
                  }
                }}
              >
                <FontAwesome5
                  name={item.icon}
                  size={item.size}
                  color={item.color}
                />
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 10,
    paddingTop: 3,
    paddingRight: 5,
    zIndex: 1000,
  },
  fab: {
    backgroundColor: "#e31837",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  menuItemsContainer: {
    position: "absolute",
    top: 5,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 1,
  },
  menuIcon: {
    // backgroundColor: "#f3f4f6",
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 1,
  },
  activeMenuItem: {
    backgroundColor: "#848484",
    borderWidth: 2,
    borderColor: "#f3f4f6",
    fontWeight: "bold",
  },
  inactiveMenuItem: {
    backgroundColor: "#f3f4f6",
  },
});
