import { useRef, useEffect, useState } from "react";

type DebouncedFunction<T extends (...args: any[]) => void> = [
	debouncedFn: T,
	showIcon: boolean,
];

export function useDebounce<T extends (...args: any[]) => void>(
	callback: T,
	delay = 500
): DebouncedFunction<T> {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [showIcon, setShowIcon] = useState(true);

	const debouncedFunction = ((...args: any[]) => {
		setShowIcon(false);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			callback(...args);
			setShowIcon(true);
		}, delay);
	}) as T;

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return [debouncedFunction, showIcon];
}
