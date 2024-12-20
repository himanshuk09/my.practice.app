import React, { memo } from "react";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { View, Text, Pressable } from "react-native";
import Portfolio from "@/components/SVG/Portfolio";
import Prices from "@/components/SVG/Prices";
import PFC from "@/components/SVG/PFC";
import Load from "@/components/SVG/Load";
import Settings from "@/components/SVG/Settings";
import { i18n } from "@/languageKeys/i18nConfig";
import { router } from "expo-router";

const routeToComponent = (icon: string) => {
  switch (icon) {
    case "PRICES":
      return <Prices />;
    case "PFC":
      return <PFC />;
    case "LOAD":
      return <Load />;
    case "SIGNALS":
      return <Load />;
    case "PORTFOLIO":
      return <Portfolio />;
    case "SETTINGS":
      return <Settings />;
    default:
      return <Text />;
  }
};
const NotificationIcon = ({ count }: { count: number }) => (
  <Svg
    height="40"
    width="40"
    style={{ position: "absolute", top: 5, right: 5, zIndex: 0 }}
  >
    <G>
      <Circle cx="20" cy="20" r="10" fill="#e31837" />
      <SvgText
        x="20"
        y="20"
        dy="3"
        fontSize="10"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        {count}
      </SvgText>
    </G>
  </Svg>
);

const MenuCard = memo(({ item, index, startLoader }: any) => {
  return (
    <Pressable
      className=" m-1 items-center"
      onPressIn={() => {
        startLoader();
        // setTimeout(() => );
        router.push(item.route);
      }}
    >
      <View className="relative   bg-gray-100 w-40 h-40 m-2 rounded-sm justify-center items-center">
        {routeToComponent(item?.icon)}
        <Text className="text-lg text-gray-500 font-bold uppercase">
          {i18n.t(item?.title)}
        </Text>
        {item?.notificationCount > 0 && (
          <NotificationIcon count={item?.notificationCount} />
        )}
      </View>
    </Pressable>
  );
});

export default MenuCard;
