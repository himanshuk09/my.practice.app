import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { ReactNode, useEffect } from "react";

type ProtectedRouteProps = {
	children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { session, setSessionValue } = useAuth();

	useEffect(() => {
		const checkAuth = async () => {
			const storedToken = await AsyncStorage.getItem("token");

			if (storedToken) {
				if (!session) {
					// Assuming your useAuth hook has a way to update the session
					// based on the token (e.g., an API call within the hook)
					setSessionValue(true); // Or trigger your session update logic
				}
			} else {
				// Token doesn't exist, redirect to login
				setSessionValue(false);
				return <Redirect href="/" />;
			}
		};

		checkAuth();
	}, [session, setSessionValue]);

	// While the effect runs, you might want to show a loading state
	if (!session) {
		return <Redirect href="/" />; // Or a loading indicator
	}

	// If session is true or the effect hasn't redirected yet, render children
	return <React.Fragment>{children}</React.Fragment>;
}
