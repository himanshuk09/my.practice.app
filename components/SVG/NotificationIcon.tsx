import { Platform } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
const NotificationIcon = ({ count }: { count: number }) => (
	<Svg
		height="40"
		width="40"
		style={{ position: "absolute", top: 14, right: 12, zIndex: 0 }}
	>
		<G>
			<Circle
				cx="20"
				cy={Platform.OS === "web" ? 19 : 20}
				r="10"
				fill="#e31837"
			/>
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

export default NotificationIcon;
