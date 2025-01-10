import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { i18n } from "@/languageKeys/i18nConfig";

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
    const getRatingText = (rating: number) => {
        switch (rating) {
            case 1:
                return { emoji: "😔", text: "poor", color: "text-red-500" };
            case 1.5:
                return {
                    emoji: "😟",
                    text: "below_average",
                    color: "text-red-400",
                };
            case 2:
                return { emoji: "😕", text: "fair", color: "text-orange-500" };
            case 2.5:
                return {
                    emoji: "😐",
                    text: "almost_average",
                    color: "text-orange-400",
                };
            case 3:
                return {
                    emoji: "😐",
                    text: "average",
                    color: "text-yellow-500",
                };
            case 3.5:
                return {
                    emoji: "🙂",
                    text: "above_average",
                    color: "text-yellow-400",
                };
            case 4:
                return { emoji: "🙃", text: "good", color: "text-green-500" };
            case 4.5:
                return {
                    emoji: "😃",
                    text: "very_good",
                    color: "text-green-400",
                };
            case 5:
                return {
                    emoji: "😍",
                    text: "excellent",
                    color: "text-blue-500",
                };
            default:
                return { emoji: "", text: "", color: "text-gray-500" };
        }
    };
    const { emoji, text, color } = getRatingText(rating);
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
                            onPress={() => handleRating(starIndex)}
                            style={styles.star}
                        >
                            {renderStar(starIndex)}
                        </TouchableOpacity>
                    );
                })}
            </View>
            {rating && color && emoji && text && (
                <Text
                    className={`font-extrabold text-md ${color} text-center mb-1`}
                >
                    {emoji} {i18n.t(text)}
                </Text>
            )}
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
