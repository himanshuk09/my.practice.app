// import React, { useEffect, useRef } from "react";
// import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";

// const ChartShimmer = () => {
//     const shimmerValue = useRef(new Animated.Value(-1)).current;
//     const barHeights = useRef(
//         Array.from({ length: 10 }).map(() => new Animated.Value(50))
//     ).current; // Initial bar heights
//     const screenWidth = Dimensions.get("window").width;

//     useEffect(() => {
//         // Animate the shimmer overlay
//         const startShimmer = () => {
//             Animated.loop(
//                 Animated.timing(shimmerValue, {
//                     toValue: 2,
//                     duration: 1000, // Increased speed
//                     useNativeDriver: true,
//                 })
//             ).start();
//         };

//         // Animate the bars' heights in sequential order
//         const animateBarsSequentially = () => {
//             barHeights.forEach((barHeight, index) => {
//                 Animated.loop(
//                     Animated.sequence([
//                         Animated.delay(index * 150), // Stagger each bar's start by 150ms
//                         Animated.timing(barHeight, {
//                             toValue:
//                                 Math.random() > 0.7
//                                     ? 200
//                                     : Math.random() * 150 + 50, // Occasionally touch the bottom
//                             duration: 300, // Faster animation
//                             useNativeDriver: false,
//                         }),
//                         Animated.timing(barHeight, {
//                             toValue:
//                                 Math.random() > 0.7
//                                     ? 200
//                                     : Math.random() * 150 + 50, // Reset or randomly adjust height
//                             duration: 300, // Faster animation
//                             useNativeDriver: false,
//                         }),
//                     ])
//                 ).start();
//             });
//         };

//         startShimmer();
//         animateBarsSequentially();
//     }, [shimmerValue, barHeights]);

//     const translateX = shimmerValue.interpolate({
//         inputRange: [-1, 2],
//         outputRange: [-screenWidth, screenWidth],
//     });

//     return (
//         <View style={styles.chartContainer}>
//             {barHeights.map((barHeight, index) => (
//                 <View key={index} style={styles.barWrapper}>
//                     <Animated.View
//                         style={[styles.bar, { height: barHeight }]}
//                     />
//                 </View>
//             ))}

//             {/* Shimmer Overlay */}
//             <Animated.View
//                 style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     chartContainer: {
//         height: 300,
//         width: "100%",
//         backgroundColor: "#ffffff",
//         borderRadius: 8,
//         overflow: "hidden",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "flex-end",
//         padding: 3,
//         position: "relative",
//     },
//     barWrapper: {
//         flex: 1,
//         marginVertical: 30,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     bar: {
//         width: "30%",
//         backgroundColor: "#f0f0f0",
//         borderRadius: 4,
//     },
//     shimmerOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(227, 227, 227, 0.6)",
//         opacity: 0.5,
//     },
// });

// export default ChartShimmer;
//...........

import { st } from "@/utils/Styles";
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

const ShimmerPlaceholder = ({ style }: any) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={[styles.shimmerContainer, style]}>
            <Animated.View
                style={[
                    styles.shimmerGradient,
                    { transform: [{ translateX }] },
                ]}
            />
        </View>
    );
};

const ChartShimmer = () => {
    return (
        <View style={[styles.container, st.boxShadow]}>
            {/* Header */}
            <View style={[styles.header, st.boxShadow]}>
                <View className="flex-col">
                    <ShimmerPlaceholder style={styles.title} />
                    <ShimmerPlaceholder style={styles.title} />
                </View>
                <ShimmerPlaceholder style={styles.switch} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {["Day", "Week", "Month", "Quarter", "Year"].map((_, index) => (
                    <ShimmerPlaceholder key={index} style={styles.tab} />
                ))}
            </View>

            {/* Graph Placeholder */}
            <ShimmerPlaceholder style={styles.graph} />

            {/* Button */}
            <ShimmerPlaceholder style={styles.button} />
        </View>
    );
};
const PortFolioChartShimmer = () => {
    return (
        <View style={[styles.container, st.boxShadow]}>
            <ShimmerPlaceholder
                style={[styles.graph, { height: 150, marginBottom: 2 }]}
            />
            <ShimmerPlaceholder style={styles.graph} />
            <ShimmerPlaceholder style={styles.button} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff", margin: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        height: 70,
    },
    title: { width: 150, height: 15, borderRadius: 4, margin: 3 },
    switch: { width: 50, height: 25, borderRadius: 12 },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    tab: {
        width: Platform.OS !== "web" ? 60 : 80,
        height: 40,
        borderRadius: 1,
    },
    graph: {
        width: Platform.OS !== "web" ? width - 32 : "98%",
        height: Platform.OS !== "web" ? 400 : 500,
        borderRadius: 8,
    },
    button: {
        width: Platform.OS !== "web" ? width - 32 : "98%",
        height: 50,
        borderRadius: 8,
        marginTop: 20,
        backgroundColor: "#e31837",
    },
    shimmerContainer: {
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
        position: "relative",
    },
    shimmerGradient: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        position: "absolute",
    },
});

export { ChartShimmer, PortFolioChartShimmer };
