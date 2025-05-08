import { useEffect, useRef, useState } from "react";
import { usePathname, useSegments } from "expo-router";

function useIsComingFromPortfolioDetail(): boolean {
	const pathname = usePathname();
	const segments = useSegments();
	const segmentPath = segments.join("/");
	const previousPath = useRef<string | null>(null);
	const [isFromDetail, setIsFromDetail] = useState(true);

	useEffect(() => {
		// Routes to match (with parameter placeholders)
		const idRoutes = ["dashboard/(tabs)/portfolio/[id]"];

		// Check if previousPath matches one of the id routes
		const wasIdRoute = idRoutes.includes(previousPath.current ?? "");

		if (previousPath.current && wasIdRoute) {
			setIsFromDetail(true);
		} else {
			setIsFromDetail(false);
		}

		// Update previous path for next navigation
		previousPath.current = segmentPath;
	}, [pathname]);

	return isFromDetail;
}
export default useIsComingFromPortfolioDetail;
