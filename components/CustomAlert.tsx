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
	icon,
	iconColor,
	buttons,
	confirmText = "OK",
	confirmColorText = "#e31837",
	cancelText = "Cancel",
	cancelColorText = "#94a3b8",
	onCancel,
	onConfirm,
	showCancelButton = false,
}: AlertProps) => {
	const defaultButtons: Button[] = [
		{
			text: i18n.t(cancelText),
			textStyle: {
				fontSize: 16,
				fontWeight: "600",
				color: cancelColorText,
				textTransform: "uppercase",
			} as TextStyle,
			onPress: onCancel ?? (() => null),
		},
		{
			text: i18n.t(confirmText),
			textStyle: {
				fontSize: 16,
				fontWeight: "bold",
				color: confirmColorText,
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
		confirmText,
		confirmColorText,
		cancelText,
		cancelColorText,
		showCancelButton: !!showCancelButton,
		buttons: buttons && buttons.length > 0 ? buttons : defaultButtons,
	});
};

export default CustomAlert;
