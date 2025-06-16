/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	// NOTE: Update this to include the paths to all of your component files.
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			screens: {
				xxs: "1rem", // min-width
			},
			colors: {
				primary: "#e31836", // Used for primary accent, buttons, etc.
				secondary: "#ebebeb", // Background colors for cards, submenus, etc.
				accent: "#f5504e", // Call-to-action buttons, highlights

				// Dashboard
				dashboardBg: "#ffffff", // Background for the dashboard
				dashboardCardBg: "#ebebeb", // Menu card background
				svgColor: "#e31836", // SVG icon color
				fontColor: "#3c3c3c", // Default font color

				// Tabs screen
				activeText: "#808080", // Active tab text color
				inactiveText: "#c8c8c8", // Inactive tab text color
				listBg: "#ffffff", // List background
				listText: "#484848", // List text color
				listShadow: "#ebebeb", // List shadow

				// Accordion submenu
				accordionBg: "#ebebeb", // Accordion submenu background

				// Chart screen
				chartHeaderBg: "#ebebeb", // Chart header background
				chartText: "#9a9b9f", // Chart text color

				// Touchable opacity
				touchableOpacity: "#e31836", // Touchable button color

				// Dropdown
				dropdownTitleText: "#e6e6e6", // Dropdown title text color
				dropdownSecondTitle: "#9a9b9f", // Second title color
				dropdownActiveText: "#000000", // Active dropdown text color
				dropdownActiveBg: "#ffffff", // Active dropdown background
				dropdownBorder: "#e31837", // Dropdown border color
				dropdownInactiveText: "#333333", // Inactive dropdown text color
				dropdownBg: "#d6d6d6", // Dropdown background color
				dropdownCardBg: "#f2f2f2",
				// Screen main card header
				mainCardHeaderBg: "#ffffff", // Main card header background
				mainCardHeaderText: "#808081", // Main card header text color

				// Toggle
				toggleActiveBg: "#ffffff", // Toggle active background
				toggleActiveText: "#e31836", // Toggle active text color
				toggleBorder: "#e31836", // Toggle border color
				toggleInactiveText: "#8b8c8c", // Toggle inactive text color
				toggleBg: "#f3f4f5", // Toggle background color

				// Cards
				cardBg: "#ebebeb", // Card background
				cardTextHeader: "#948988", // Card text header color
				cardText: "#9E9B9B",
				cardShadow: "#e0e0e0", // Card shadow
				disableCard: "#CACACA",
				// Start button (CTA)
				startBtn: "#f5504e", // Start button background

				// Border and shadow for blue elements
				blueBorder: "#66Afe9", // Blue border
				blueShadow: "#d8eaf9", // Blue shadow

				statusBar: "#C3C3C3",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};
