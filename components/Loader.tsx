import {
  View,
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, {
  Circle,
  Defs,
  Polyline,
  RadialGradient,
  Stop,
  Image as SvgImage,
} from "react-native-svg";
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const CircularLoaderSVGWeb = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      rotationValue.current = (rotationValue.current + 4) % 360;
      Animated.timing(rotation, {
        toValue: rotationValue.current,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#ffffffb6",
        backgroundColor: "#ffffffc9",
        zIndex: 50,
      }}
    >
      <Animated.View
        style={{
          transform: [{ rotate: rotateInterpolate }],
        }}
      >
        <Svg
          width="100"
          height="75"
          viewBox="0 0 200 200"
          style={{ transform: [{ scaleX: -1 }] }}
        >
          <Defs>
            <RadialGradient
              id="a7"
              cx=".66"
              fx=".66"
              cy=".3125"
              fy=".3125"
              gradientTransform="scale(1.5)"
            >
              <Stop offset="0" stopColor="#E31837" />
              <Stop offset="0.3" stopColor="#E31837" stopOpacity="0.9" />
              <Stop offset="0.6" stopColor="#E31837" stopOpacity="0.6" />
              <Stop offset="0.8" stopColor="#E31837" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#E31837" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Circle
            fill="none"
            stroke="url(#a7)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray="200 1000"
            strokeDashoffset="0"
            cx="100"
            cy="100"
            r="70"
          />

          <Circle
            fill="none"
            opacity=".2"
            stroke="#E31837"
            strokeWidth="28"
            strokeLinecap="round"
            cx="100"
            cy="100"
            r="70"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
const CircularLoaderSVGAndroid = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000, // Rotate fully in 2 seconds
        useNativeDriver: true, // Use native driver for smooth animations
      })
    );

    animation.start();

    return () => animation.stop();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0 justify-center items-center bg-[#f5f5f5fa] z-50 ">
      <Animated.View
        className="justify-center items-center"
        style={[{ transform: [{ rotate: rotateInterpolate }] }]}
      >
        <Svg
          width="100"
          height="75"
          viewBox="0 0 200 200"
          style={{ transform: [{ scaleX: -1 }] }}
        >
          <Defs>
            <RadialGradient
              id="a7"
              cx=".66"
              fx=".66"
              cy=".3125"
              fy=".3125"
              gradientTransform="scale(1.5)"
            >
              <Stop offset="0" stopColor="#E31837" />
              <Stop offset="0.3" stopColor="#E31837" stopOpacity="0.9" />
              <Stop offset="0.6" stopColor="#E31837" stopOpacity="0.6" />
              <Stop offset="0.8" stopColor="#E31837" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#E31837" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Circle
            fill="none"
            stroke="url(#a7)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray="200 1000"
            strokeDashoffset="0"
            cx="100"
            cy="100"
            r="70"
          />

          <Circle
            fill="none"
            opacity=".2"
            stroke="#E31837"
            strokeWidth="28"
            strokeLinecap="round"
            cx="100"
            cy="100"
            r="70"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
const ChartCircularLoaderSVGAndroid = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000, // Rotate fully in 2 seconds
        useNativeDriver: true, // Use native driver for smooth animations
      })
    );

    animation.start();

    return () => animation.stop();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0 justify-center items-center bg-[#f5f5f5c2] z-50 ">
      <Animated.View
        className="justify-center items-center"
        style={[{ transform: [{ rotate: rotateInterpolate }] }]}
      >
        <Svg
          width="100"
          height="75"
          viewBox="0 0 200 200"
          style={{ transform: [{ scaleX: -1 }] }}
        >
          <Defs>
            <RadialGradient
              id="a7"
              cx=".66"
              fx=".66"
              cy=".3125"
              fy=".3125"
              gradientTransform="scale(1.5)"
            >
              <Stop offset="0" stopColor="#E31837" />
              <Stop offset="0.3" stopColor="#E31837" stopOpacity="0.9" />
              <Stop offset="0.6" stopColor="#E31837" stopOpacity="0.6" />
              <Stop offset="0.8" stopColor="#E31837" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#E31837" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Circle
            fill="none"
            stroke="url(#a7)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray="200 1000"
            strokeDashoffset="0"
            cx="100"
            cy="100"
            r="70"
          />

          <Circle
            fill="none"
            opacity=".2"
            stroke="#E31837"
            strokeWidth="28"
            strokeLinecap="round"
            cx="100"
            cy="100"
            r="70"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
const CircularLoaderDefault = () => (
  <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-[#f5f5f5ed] z-50">
    <ActivityIndicator size={70} color="#E31837" />
  </View>
);
const LoadingAnimation = () => {
  const dashOffset = new Animated.Value(192); // Initial dash offset

  useEffect(() => {
    // Start looping animation for dash offset
    Animated.loop(
      Animated.timing(dashOffset, {
        toValue: 0,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View
      collapsable={Platform.OS === "web" ? undefined : undefined}
      className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-[#ffffff93] z-50"
    >
      <Svg width={64} height={48} viewBox="0 0 64 48">
        {/* Back Polyline for the faint outline */}
        <Polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          stroke="#ff4d5033"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Front Polyline for the animated line */}
        <AnimatedPolyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          stroke="#ff4d4f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="48, 144"
          strokeDashoffset={dashOffset}
        />
      </Svg>
    </View>
  );
};
const Loader: React.FC = () => {
  return (
    <>
      {Platform.OS !== "web" ? (
        <CircularLoaderSVGAndroid />
      ) : (
        <CircularLoaderSVGWeb />
      )}
    </>
  );
};
export default Loader;
export const ChartLoader: React.FC = () => {
  return (
    <>
      {Platform.OS !== "web" ? (
        <ChartCircularLoaderSVGAndroid />
      ) : (
        <CircularLoaderSVGWeb />
      )}
    </>
  );
};
