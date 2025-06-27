import * as React from "react";
import { Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedArrowSVG = ({
	height = 43,
	width = 43,
	color = "#e31837",
}: {
	height?: number;
	width?: number;
	color?: string;
}) => {
	const translateY = React.useRef(new Animated.Value(-10)).current;

	React.useEffect(() => {
		const loopAnimation = () => {
			translateY.setValue(-10); // Start above view

			Animated.timing(translateY, {
				toValue: 20, // Fully enters base path (base starts ~y=17)
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			}).start(() => {
				loopAnimation(); // restart
			});
		};

		loopAnimation();
	}, []);

	return (
		<Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
			{/* Arrow path that slides down and enters base */}
			<AnimatedPath
				transform={[{ translateY }]}
				d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Z"
				fill={color}
			/>

			{/* Static download tray path */}
			<Path
				transform="translate(0, 3)"
				d="M6 17a1 1 0 1 0-2 0v.6C4 19.482 5.518 21 7.4 21h9.2c1.882 0 3.4-1.518 3.4-3.4V17a1 1 0 1 0-2 0v.6c0 .778-.622 1.4-1.4 1.4H7.4c-.778 0-1.4-.622-1.4-1.4V17Z"
				fill={color}
			/>
		</Svg>
	);
};

export default AnimatedArrowSVG;
