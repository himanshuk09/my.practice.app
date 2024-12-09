import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import { i18n } from "@/languageKeys/i18nConfig";
import { useEffect, useRef } from "react";
import { activeLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const tabRefs = useRef<(View | null)[]>([]);
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

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

  const handleFocusAnimation = (index: number, isFocused: boolean) => {
    Animated.timing(animatedValues[index], {
      toValue: isFocused ? 1.1 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    state.routes.forEach((_: any, index: any) => {
      handleFocusAnimation(index, state.index === index);
    });
  }, [state.index]);
  const dispatch = useDispatch();
  return (
    <View className="overflow-hidden h-9 bg-white">
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
              setTimeout(() => navigation.navigate(route.name), 100);
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
                className={`py-1 px-5 items-center justify-center ${
                  isFocused && "opacity-100"
                }`}
                onPress={onPress}
              >
                <Text
                  className={`font-bold uppercase text-[#BDBDBD] text-md ${
                    isFocused && "text-[#5a5858]"
                  }`}
                >
                  {i18n.t(options.tabBarLabel || route.name)}
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
export default function TabLayout() {
  return (
    <MaterialTopTabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarScrollEnabled: true,
      }}
      // screenOptions={{
      //   tabBarScrollEnabled: true,
      //   tabBarLabelStyle: {
      //     // fontSize: 14,
      //     fontWeight: "bold",
      //     textTransform: "uppercase",
      //   },
      //   tabBarStyle: {
      //     backgroundColor: "white",
      //   },
      //   tabBarActiveTintColor: "#616161",
      //   tabBarInactiveTintColor: "#BDBDBD",

      //   tabBarIndicatorStyle: {
      //     backgroundColor: "#616161",
      //     height: 1,
      //   },
      //   tabBarItemStyle: {
      //     opacity: 1,
      //     // width: 110,
      //   },
      //   tabBarPressColor: "#E0E0E0",
      //   tabBarPressOpacity: 0,
      //   animationEnabled: true,
      //   tabBarBounces: false,
      // }}
    >
      <MaterialTopTabs.Screen
        name="prices"
        options={{ title: i18n.t("prices") }}
      />
      <MaterialTopTabs.Screen name="pfc" options={{ title: i18n.t("pfc") }} />
      <MaterialTopTabs.Screen
        name="load"
        options={{ title: i18n.t("loaddata") }}
      />
      <MaterialTopTabs.Screen
        name="signals"
        options={{ title: i18n.t("signals") }}
      />
      <MaterialTopTabs.Screen
        name="portfolio"
        options={{ title: i18n.t("portfolio") }}
      />
    </MaterialTopTabs>
  );
}
