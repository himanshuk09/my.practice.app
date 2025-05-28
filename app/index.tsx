import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
	const { session } = useAuth();
	return session ? (
		<Redirect href="/dashboard" />
	) : (
		<Redirect href="/(auth)/login" />
	);
}
