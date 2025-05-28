import { TextStyle } from "react-native";
import { Alert } from "rn-custom-alert-prompt";
import { i18n } from "@/localization/config";

type Button = {
	text: string;
	textStyle?: TextStyle;
	onPress?: () => void;
};

type AlertProps = {
	title: string;
	description?: string;
	icon?: "error" | "info" | "success" | "question";
	iconColor?: string;
	confirmText?: string;
	confirmColorText?: string;
	cancelText?: string;
	cancelColorText?: string;
	buttons?: Button[];
	showCancelButton?: Boolean;
	onCancel?: () => void;
	onConfirm?: () => void;
};

const CustomAlert = ({
	title,
	description,
	icon = "info",
	iconColor = "#000",
	buttons,
	onCancel,
	onConfirm,
}: AlertProps) => {
	// If no buttons passed, create default Cancel / OK buttons
	const defaultButtons: Button[] = [
		{
			text: i18n.t("Cancel"),
			textStyle: {
				fontSize: 16,
				fontWeight: "600",
				color: "#94a3b8",
			} as TextStyle,
			onPress: onCancel ?? (() => null),
		},
		{
			text: i18n.t("OK"),
			textStyle: {
				fontSize: 16,
				fontWeight: "bold",
				color: "#e31837",
				textTransform: "uppercase",
			} as TextStyle,
			onPress: onConfirm ?? (() => null),
		},
	];

	Alert.alert({
		title: i18n.t(title),
		description: i18n.t(description),
		icon,
		iconColor,
		confirmText: "",
		confirmColorText: "",
		cancelText: "",
		cancelColorText: "",
		showCancelButton: false,
		buttons: buttons && buttons.length > 0 ? buttons : defaultButtons,
	});
};

export default CustomAlert;
