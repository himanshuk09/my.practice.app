// components/ToastProvider.tsx
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import toastConfig from "./ToastConfig";
import { setBottomInset } from "./safeArea";

const ToastProvider = () => {
	const insets = useSafeAreaInsets();
	useEffect(() => {
		setBottomInset(insets.bottom || 40);
	}, [insets.bottom]);

	return <Toast config={toastConfig} />;
};

export default ToastProvider;
