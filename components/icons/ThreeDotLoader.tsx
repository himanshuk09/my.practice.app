import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Platform } from "react-native";

const DOT_COUNT = 4;
const DURATION = 200;

const ThreeDotLoader = () => {
	const opacities = useRef(
		Array.from({ length: DOT_COUNT }, () => new Animated.Value(0))
	).current;

	useEffect(() => {
		const animations = opacities.map((dot, index) =>
			Animated.timing(dot, {
				toValue: 1,
				duration: DURATION,
				useNativeDriver: Platform.OS === "android",
				delay: index * DURATION,
			})
		);

		const resetAnimations = opacities.map((dot) =>
			Animated.timing(dot, {
				toValue: 0,
				duration: 0,
				useNativeDriver: Platform.OS === "android",
			})
		);

		const loop = () => {
			Animated.sequence([
				Animated.stagger(DURATION, animations),
				Animated.delay(300),
				Animated.parallel(resetAnimations),
			]).start(() => loop());
		};

		loop();
	}, []);

	return (
		<View style={styles.container}>
			{opacities.map((opacity, idx) => (
				<Animated.Text key={idx} style={[styles.dot, { opacity }]}>
					●
				</Animated.Text>
			))}
		</View>
	);
};

export default ThreeDotLoader;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 4,
	},
	dot: {
		fontSize: 15,
		color: "white",
	},
});
