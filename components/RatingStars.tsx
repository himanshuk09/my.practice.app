import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RatingStars = ({ maxStars = 5 }: any) => {
	const [rating, setRating] = useState(0);
	const [halfStar, setHalfStar] = useState(false);

	// Function to handle star press
	const handleRating = (index: any) => {
		if (halfStar) {
			setRating(index - 0.5);
		} else {
			setRating(index);
		}
		setHalfStar(!halfStar);
	};
	const renderStar = (index: any) => {
		const full = rating >= index;
		const half = rating >= index - 0.5 && rating < index;

		if (half) {
			return <Ionicons name="star-half" size={30} color="#f5504e" />;
		}
		if (full) {
			return <Ionicons name="star" size={30} color="#f5504e" />;
		}
		return <Ionicons name="star-outline" size={30} color="#f5504e" />;
	};

	return (
		<View style={styles.container}>
			<View style={styles.starContainer}>
				{Array.from({ length: maxStars }).map((_, index) => {
					const starIndex = index + 1;
					return (
						<TouchableOpacity
							key={starIndex}
							onPressIn={() => handleRating(starIndex)}
							onPress={() => handleRating(starIndex)}
							style={styles.star}
						>
							{renderStar(starIndex)}
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
	starContainer: {
		flexDirection: "row",
	},
	star: {
		padding: 5,
	},
	ratingText: {
		marginTop: 10,
		fontSize: 16,
	},
});

export default RatingStars;
