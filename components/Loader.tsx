import { View, ActivityIndicator, Animated, Platform } from "react-native";
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
const CircularLoader = () => {
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

const Loader: React.FC = () => {
  return <CircularLoader1 />;
};
export default Loader;

const CircularLoader1 = () => (
  <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-[#ffffffc9] z-50">
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
//  <svg xmlns="http://www.w3.org/2000/svg" viewBox="9172 243.793 51.05 47.207" width="40" height="37.04" ><defs><style>      .cls-1 {        fill: #e31837;      }    </style></defs><g id="Group_317" data-name="Group 317" transform="translate(9172 243.793)"><g id="Group_313" data-name="Group 313" transform="translate(11.143 4.819)"><path id="Path_142" data-name="Path 142" class="cls-1" d="M-.787,0H-4V3.831L-.169,0Z" transform="translate(4)" /></g><g id="Group_314" data-name="Group 314" transform="translate(2.315 0)"><path id="Path_143" data-name="Path 143" class="cls-1" d="M0,0V.191L.524.715l4.3,4.3V0Z" /></g><g id="Group_315" data-name="Group 315" transform="translate(2.308 8.142)"><path id="Path_144" data-name="Path 144" class="cls-1" d="M0-8.436H-.009V-3.8H40.15V-15.665H35.331v7.229H31.316V-23.7H26.5V-8.436H22.48V-36.548H17.662V-8.436H13.645V-39.224L9.777-35.356l-.95.951V-8.436H4.817V-38.045L0-42.863Z" transform="translate(0.009 42.863)" /></g><g id="Group_316" data-name="Group 316" transform="translate(0 0.263)"><path id="Path_145" data-name="Path 145" class="cls-1" d="M-2.685-2.657l-9.255-9.254-1.7,1.7L-2.685.751,8.158-10.092,30.6,12.349,25.76,17.187H37.407V5.541L32.3,10.646,8.158-13.5Z" transform="translate(13.644 13.499)" /></g></g></svg>
//  width="40" height="37.04"
//  <svg xmlns="http://www.w3.org/2000/svg" viewBox="9172 243.793 51.05 47.207" width="100%" height="100%"  >
//   <defs>
//     <style>
//       .cls-1 {
//         fill: #e31837;
//       }
//     </style>
//   </defs>
//   <g id="Group_317" data-name="Group 317" transform="translate(9172 243.793)">
//     <g id="Group_313" data-name="Group 313" transform="translate(11.143 4.819)">
//       <path id="Path_142" data-name="Path 142" class="cls-1" d="M-.787,0H-4V3.831L-.169,0Z" transform="translate(4)"/>
//     </g>
//     <g id="Group_314" data-name="Group 314" transform="translate(2.315 0)">
//       <path id="Path_143" data-name="Path 143" class="cls-1" d="M0,0V.191L.524.715l4.3,4.3V0Z"/>
//     </g>
//     <g id="Group_315" data-name="Group 315" transform="translate(2.308 8.142)">
//       <path id="Path_144" data-name="Path 144" class="cls-1" d="M0-8.436H-.009V-3.8H40.15V-15.665H35.331v7.229H31.316V-23.7H26.5V-8.436H22.48V-36.548H17.662V-8.436H13.645V-39.224L9.777-35.356l-.95.951V-8.436H4.817V-38.045L0-42.863Z" transform="translate(0.009 42.863)"/>
//     </g>
//     <g id="Group_316" data-name="Group 316" transform="translate(0 0.263)">
//       <path id="Path_145" data-name="Path 145" class="cls-1" d="M-2.685-2.657l-9.255-9.254-1.7,1.7L-2.685.751,8.158-10.092,30.6,12.349,25.76,17.187H37.407V5.541L32.3,10.646,8.158-13.5Z" transform="translate(13.644 13.499)"/>
//     </g>
//   </g>
// </svg>
