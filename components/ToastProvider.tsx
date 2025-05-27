// components/ToastProvider.tsx
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import toastConfig from "./ToastConfig";
import { setBottomInset, setLocalebyhook } from "./global";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ToastProvider = () => {
	const insets = useSafeAreaInsets();
	const locale = useSelector((state: RootState) => state.culture.locale);
	useEffect(() => {
		setBottomInset(insets.bottom || 40);
	}, [insets.bottom]);
	useEffect(() => {
		setLocalebyhook(locale);
	}, [locale]);
	return <Toast config={toastConfig} />;
};

export default ToastProvider;
