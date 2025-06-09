import { useRef, useEffect } from "react";

export function useDebounce(callback: any, delay = 500) {
	const timeoutRef: any = useRef(null);

	const debouncedFunction = (...args: any) => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};

	// Clean up on unmount
	useEffect(() => {
		return () => clearTimeout(timeoutRef.current);
	}, []);

	return debouncedFunction;
}
