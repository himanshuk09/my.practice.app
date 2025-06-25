/**
 *First scren that  Redirect to login or dashboard based on session
 */

import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTEKEYS } from "@/utils/messages";

export default function Home() {
	const { session } = useAuth();
	return session ? (
		<Redirect href={ROUTEKEYS.DASHBOARD} />
	) : (
		<Redirect href={ROUTEKEYS.LOGIN} />
	);
}
