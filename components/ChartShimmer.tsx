import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const ShimmerPlaceholder = ({ style }: any) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: Platform.OS !== "web" ? true : false,
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
        <View style={[styles.container]}>
            {/* Header */}
            <View style={[styles.header]}>
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
        <View style={[styles.container]}>
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
        height: Platform.OS !== "web" ? height * 0.6 : 600,
        borderRadius: 8,
    },
    button: {
        width: Platform.OS !== "web" ? width - 32 : "98%",
        height: 40,
        borderRadius: 1,
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
