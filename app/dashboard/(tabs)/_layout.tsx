import Header from "@/components/MainHeader";
import { i18n } from "@/languageKeys/i18nConfig";
import { activeLoading } from "@/store/navigationSlice";
import { Slot, Tabs, usePathname } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useDispatch } from "react-redux";

// Custom Tab Bar
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  notificationCounts,
}: any) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const tabRefs = useRef<(View | null)[]>([]);
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;
  const handleFocusAnimation = (index: number, isFocused: boolean) => {
    Animated.timing(animatedValues[index], {
      toValue: isFocused ? 1.05 : 1,
      duration: 50,
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
        className="h-16"
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const notificationCount = notificationCounts[route?.name] || 0;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              setTimeout(() => {
                navigation.navigate(route.name);
              });
              dispatch(activeLoading());
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
                className={`py-2 px-5 items-center justify-center ${
                  isFocused && "opacity-100"
                }`}
                onPress={onPress}
              >
                <Text
                  className={`font-bold uppercase text-md ${
                    isFocused ? "text-[#616161]" : "text-[#BDBDBD]"
                  }`}
                >
                  {i18n.t(options.tabBarLabel || route.name)}
                </Text>
                {notificationCount > 0 && (
                  <View
                    className="bg-red-600 rounded-full justify-center items-center absolute top-0 right-0 w-5 h-5"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Text className="text-white text-xs font-bold">
                      {notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {isFocused && <View className="bg-[#616161] h-px w-full" />}
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};
// Main Tab Navigator
const TabNavigatorLayout = () => {
  const pathname = usePathname();
  const isIdRoute =
    /^\/dashboard\/test\/\d+$/.test(pathname) ||
    /^\/dashboard\/loaddata\/\d+$/.test(pathname) ||
    /^\/dashboard\/signals\/\d+$/.test(pathname) ||
    /^\/dashboard\/prices\/\d+$/.test(pathname) ||
    /^\/dashboard\/pfc\/\d+$/.test(pathname) ||
    /^\/dashboard\/portfolio\/portfolio-overview$/.test(pathname) ||
    /^\/dashboard\/prices\/settings$/.test(pathname);
  const notificationCounts = {
    prices: 0,
    pfc: 0,
    loaddata: 0,
    signals: 2,
    portfolio: 0,
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!isIdRoute && <Header />}
      <Tabs
        screenOptions={{
          tabBarButton: () => null,
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            backgroundColor: "transparent",
          },
          tabBarPosition: "top",
        }}
        tabBar={(props) => {
          if (isIdRoute) {
            return null;
          }
          return (
            <CustomTabBar {...props} notificationCounts={notificationCounts} />
          );
        }}
      >
        <Tabs.Screen name="prices" options={{ title: i18n.t("prices") }} />
        <Tabs.Screen
          name="pfc"
          options={{
            title: i18n.t("pfc"),
          }}
        />
        <Tabs.Screen name="loaddata" options={{ title: i18n.t("loaddata") }} />
        <Tabs.Screen name="signals" options={{ title: i18n.t("signals") }} />
        <Tabs.Screen
          name="portfolio"
          options={{ title: i18n.t("portfolio") }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabNavigatorLayout;
