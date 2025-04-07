import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";

const CultureNumberInput = ({ value, onNumberChange, locale = "en" }: any) => {
	const [displayValue, setDisplayValue] = useState("");
	const [lastValidValue, setLastValidValue] = useState("");

	// Format number according to locale
	const formatNumber = (input: any) => {
		if (input === "" || input === null || input === undefined) return "";

		// For formatting, we need to handle both string and number inputs
		let numericValue;
		if (typeof input === "string") {
			// Clean the string for parsing
			const cleaned = input
				.replace(locale === "de" ? /\./g : /,/g, "") // Remove thousand separators
				.replace(locale === "de" ? "," : ".", "."); // Convert to standard decimal point
			numericValue = parseFloat(cleaned);
		} else {
			numericValue = input;
		}

		if (isNaN(numericValue)) return "";

		return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 20,
		}).format(numericValue);
	};

	// Parse input to number
	const parseInput = (input: any) => {
		if (input === "") return null;

		// Remove all grouping separators and standardize decimal separator
		const cleaned = input
			.replace(locale === "de" ? /\./g : /,/g, "") // Remove thousand separators
			.replace(locale === "de" ? "," : ".", "."); // Convert to standard decimal point

		const number = parseFloat(cleaned);
		return isNaN(number) ? null : number;
	};

	// Handle input changes with live formatting
	const handleChange = (text: any) => {
		const decimalSeparator = locale === "de" ? "," : ".";
		const thousandSeparator = locale === "de" ? "." : ",";

		// More permissive regex that allows any number of digits before decimal
		const regex =
			locale === "de"
				? /^-?\d*\.?\d*$|^-?\d{1,3}(?:\.\d{3})*(?:,\d*)?$/
				: /^-?\d*\.?\d*$|^-?\d{1,3}(?:,\d{3})*(?:\.\d*)?$/;

		// Special cases
		if (text === "" || text === decimalSeparator || text === "-") {
			setDisplayValue(text);
			onNumberChange(text === "" ? null : 0);
			return;
		}

		// Check if input matches our pattern
		if (regex.test(text)) {
			const parsed = parseInput(text);
			if (parsed !== null) {
				setLastValidValue(text);
				setDisplayValue(text);
				onNumberChange(parsed);
			}
		} else {
			setDisplayValue(lastValidValue);
		}
	};

	// Handle blur - apply full formatting when leaving the field
	const handleBlur = () => {
		const parsed = parseInput(displayValue);
		console.log(parsed);
		if (parsed !== null) {
			const formatted = formatNumber(parsed);
			setDisplayValue(formatted);
			setLastValidValue(formatted);
		} else {
			setDisplayValue("0");
			setLastValidValue("0");
		}
	};

	// Update display value when the value prop changes externally
	useEffect(() => {
		if (value !== null && value !== undefined) {
			const formatted = formatNumber(value);
			setDisplayValue(formatted);
			setLastValidValue(formatted);
		} else {
			setDisplayValue("");
			setLastValidValue("");
		}
	}, [value, locale]);

	return (
		<TextInput
			className=" bg-cardBg text-slate-700 p-3"
			style={{
				height: 40,
				padding: 10,
			}}
			keyboardType="numeric"
			value={displayValue}
			onChangeText={handleChange}
			onBlur={handleBlur}
			placeholderTextColor="#9a9b9f"
			placeholder={locale === "de" ? "00,00" : "00.00"}
			maxLength={10}
		/>
	);
};

export default CultureNumberInput;
