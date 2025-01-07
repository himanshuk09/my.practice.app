import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"; // For icons
import { useState } from "react";
import { Text } from "react-native";

export default function FloatingActionMenu({
  webViewRef,
  showToggle = false,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  const [tooltip, setTooltip] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState<any>(null);
  const [pressedItem, setPressedItem] = useState<any>(null);
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
      size: 15,
      // color: !isZoomIn ? "blue" : "#848484",
      color: "#e31837",
      label: "Zoom",
    },
    {
      icon: "plus-circle",
      action: "zoomIn()",
      size: 15,
      color: "#848484",
      label: "Zoom In",
    },
    {
      icon: "minus-circle",
      action: "zoomOut()",
      size: 15,
      color: "#848484",
      label: "Zoom Out",
    },
    {
      icon: "home",
      action: "resetZoom()",
      size: 15,
      color: "#848484",
      label: "Reset Zoom",
    },
    {
      icon: "hand-point-left",
      action: "customPanLeft()",
      size: 15,
      color: "#848484",
      label: "Pan Left",
    },
    {
      icon: "hand-point-right",
      action: "customPanRight()",
      size: 15,
      color: "#848484",
      label: "Pan Right",
    },

    {
      icon: tooltip ? "circle" : "dot-circle",
      action: `toggleMarkers()`,
      size: 15,
      color: tooltip ? "#e31837" : "#848484",
      label: "Markers",
    },
    {
      icon: "download",
      action: `exportChart()`,
      size: 15,
      color: "#848484",
      label: "Download",
    },
  ];
  return showToggle ? (
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
            { right: 32 },
          ]}
        >
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
                  setPressedItem(
                    pressedItem === item.label ? null : item.label
                  );
                }}
                onLongPress={() => {
                  // Show the tooltip label on long press
                  setTooltipLabel(item?.label);
                }}
              >
                <FontAwesome5
                  name={item.icon}
                  size={item.size}
                  color={item.color}
                />
                {tooltipLabel === item.label && (
                  <Text style={styles.tooltipText}>{item.label}</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  ) : (
    <View style={styles.container}>
      <View style={[styles.menuItemsContainer, { right: 5 }]}>
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
                setTooltipLabel(null);
                setPressedItem(pressedItem === item.label ? null : item.label);
              }}
              onLongPress={() => {
                // Show the tooltip label on long press
                setTooltipLabel(item?.label);
              }}
            >
              <FontAwesome5
                name={item.icon}
                size={item.size}
                color={item.color}
                // color={pressedItem === item.label ? "blue" : item.color}
              />
              {tooltipLabel === item.label && (
                <Text style={styles.tooltipText}>{item.label}</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
    elevation: 2,
  },
  menuItemsContainer: {
    position: "absolute",
    top: 3,
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
  tooltipText: {
    marginTop: 5,
    fontSize: 12,
    color: "#848484",
    textAlign: "center",
    top: 13,
    position: "absolute",
    width: 50,
  },
});
