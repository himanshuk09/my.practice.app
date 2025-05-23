import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { ToastShowParams } from "react-native-toast-message";
import { i18n } from "@/localization/config";
type ToastType = "success" | "error" | "info" | "download";
interface ShowToastParams
	extends Omit<ToastShowParams, "type" | "text1" | "text2" | "position"> {
	type: ToastType;
	title: string;
	subtitle?: string;
	position?: "bottom" | "top";
}
export const useToast = () => {
	const insets = useSafeAreaInsets();

	/**
	 * Show a toast using react-native-toast-message with i18n support and typed options.
	 */
	const showToast = ({
		type,
		title,
		subtitle,
		position = "bottom",
		autoHide,
		bottomOffset = insets.bottom,
		...options
	}: ShowToastParams): void => {
		Toast.show({
			type,
			text1: i18n.t(title),
			text2: subtitle ? i18n.t(subtitle) : undefined,
			position,
			bottomOffset,
			visibilityTime: type === "error" ? 2000 : 3000,
			autoHide,
			topOffset: 0,
			...options,
		});
	};

	return showToast;
};
