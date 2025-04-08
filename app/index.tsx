import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Home() {
	const { session } = useAuth();

	return session ? (
		<Redirect href="/dashboard" />
	) : (
		<Redirect href="/login" />
	);
}
