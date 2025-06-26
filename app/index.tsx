/**
 *First scren that  Redirect to login or dashboard based on session
 */

import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTEKEYS } from "@/utils/messages";

const Home = () => {
	const { session } = useAuth();
	return session ? (
		<Redirect href={ROUTEKEYS.DASHBOARD} />
	) : (
		<Redirect href={ROUTEKEYS.LOGIN} />
	);
};
export default Home;
