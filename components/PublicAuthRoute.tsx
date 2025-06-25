import { Redirect } from "expo-router";
import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTEKEYS } from "@/utils/messages";

type PublicAuthRouteProps = {
	children: ReactNode;
};

export default function PublicAuthRoute({ children }: PublicAuthRouteProps) {
	const { session, loading } = useAuth();
	if (loading) return null;

	if (session) {
		return <Redirect href={ROUTEKEYS.DASHBOARD} />;
	}

	return <React.Fragment>{children}</React.Fragment>;
}
