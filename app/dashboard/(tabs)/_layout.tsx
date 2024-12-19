// import { Tabs } from "expo-router";
// import React from "react";
// import { Platform } from "react-native";

// import { HapticTab } from "@/components/HapticTab";
// import { IconSymbol } from "@/components/ui/IconSymbol";
// import TabBarBackground from "@/components/ui/TabBarBackground";
// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarPosition: "top",
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           // tabBarIcon: ({ color }) => (
//           //   <IconSymbol size={28} name="house.fill" color={color} />
//           // ),
//           tabBarIcon: () => null,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: "Explore",
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={28} name="paperplane.fill" color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
import { Tabs, usePathname, useRouter } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  Easing,
} from "react-native";

// Adjust the import path
// Adjust the import path
// Adjust the import path

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const tabRefs = useRef<(View | null)[]>([]);

  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  const handleFocusAnimation = (index: number, isFocused: boolean) => {
    Animated.timing(animatedValues[index], {
      toValue: isFocused ? 1.05 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    state.routes.forEach((_: any, index: any) => {
      handleFocusAnimation(index, state.index === index);
    });
  }, [state.index]);

  useEffect(() => {
    const scrollToFocusedTab = () => {
      const focusedTabRef = tabRefs.current[state.index];
      if (focusedTabRef) {
        focusedTabRef.measure((x, y, width, height, pageX, pageY) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              x: Math.max(0, pageX - 50),
              animated: true,
            });
          }
        });
      }
    };

    scrollToFocusedTab();
  }, [state.index]);

  return (
    <View className="overflow-hidden h-10 bg-white ">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
        }}
        className="h-14"
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              setTimeout(() => navigation.navigate(route.name), 50);
            }
          };

          return (
            <Animated.View
              key={route.key}
              ref={(el: any) => (tabRefs.current[index] = el)}
              style={{
                transform: [
                  {
                    scale: animatedValues[index],
                  },
                ],
              }}
            >
              <TouchableOpacity
                className={`py-1 px-5 items-center justify-center ${
                  isFocused && "opacity-100"
                }`}
                onPress={onPress}
              >
                <Text
                  className={`font-bold uppercase text-md ${
                    isFocused ? "text-[#616161]" : "text-[#BDBDBD]"
                  }`}
                >
                  {options.tabBarLabel || route.name}
                </Text>
              </TouchableOpacity>
              {isFocused && <View className="bg-[#616161] h-px w-full" />}
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const TabNavigator = () => {
  const pathname: any = usePathname();
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
        tabBarButton: () => null, // HapticTab disabled here
        tabBarBackground: () => null, // TabBarBackground disabled here
        animation: "shift",
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent", // You can set a color here if you want
          borderTopWidth: 0, // Optional: remove any border on top
        },
        tabBarPosition: "top",
      }}
      tabBar={(props) => {
        if (/^\/dashboard\/find\/[^/]+$/.test(pathname)) {
          return null;
        }

        return <CustomTabBar {...props} />;
      }} // Use your custom tab bar
    >
      <Tabs.Screen
        name="pfc"
        options={{
          title: "Work",
          tabBarIcon: () => null,
          lazy: true,
          transitionSpec: {
            animation: "timing",
            config: {
              duration: 150,
              easing: Easing.inOut(Easing.ease),
            },
          },
        }}
      />
    </Tabs>
  );
};

export default TabNavigator;
