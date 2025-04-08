// components/PublicAuthRoute.tsx
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Slot } from "expo-router";
import { ReactNode } from "react";

type PublicAuthRouteProps = {
	children: ReactNode;
};

export default function PublicAuthRoute({ children }: PublicAuthRouteProps) {
	const { session, loading } = useAuth();
	if (loading) return null;

	if (session) {
		return <Redirect href="/dashboard" />;
	}

	return <>{children}</>;
}
