import { StyleSheet } from "react-native";

export const st = StyleSheet.create({
    boxShadow: {
        shadowColor: "#000", // Shadow color, can be any color
        shadowOffset: { width: 0, height: 0 }, // Set to 0 for uniform shadow on all sides
        shadowOpacity: 0.7, // Adjust the opacity to control the visibility of the shadow
        shadowRadius: 5, // Larger radius for a soft, even shadow
        elevation: 7, // Use elevation for Android (this is the shadow equivalent for Android)
    },
    headerShadow: {
        shadowColor: "#000", // Shadow color
        shadowOffset: { width: 0, height: -5 }, // Top shadow (negative height to move shadow up)
        shadowOpacity: 0.5, // Adjust the opacity to control shadow intensity
        shadowRadius: 10, // Softens the shadow spread
        elevation: 15, // Elevation for Android (adds depth on Android)
    },

    bottomShadow: {
        shadowColor: "#000", // Shadow color for bottom shadow
        shadowOffset: { width: 0, height: 5 }, // Bottom shadow (positive height to move shadow down)
        shadowOpacity: 0.5, // Adjust the opacity to control shadow intensity
        shadowRadius: 10, // Softer shadow spread
        elevation: 15, // Elevation for Android (adds depth on Android)
    },
});
