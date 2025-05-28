import {
	signIn,
	signOut,
	setLoading,
	setSession,
	setUser,
} from "@/store/authSlice";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";

export function useAuth() {
	const dispatch = useDispatch();
	const { session, user, loading }: any = useSelector(
		(state: RootState) => state.auth
	);

	const signin = async (userData: any) => {
		dispatch(setLoading(true));
		// Simulate login delay
		await new Promise((r) => setTimeout(r, 1000));
		dispatch(signIn(userData));
		dispatch(setLoading(false));
	};

	const signout = async () => {
		dispatch(setLoading(true));
		await new Promise((r) => setTimeout(r, 500));
		dispatch(signOut());
		dispatch(setLoading(false));
	};
	const setSessionValue = (value: boolean) => {
		dispatch(setSession(value));
	};

	const setUserValue = (userData: any) => {
		dispatch(setUser(userData));
	};
	return {
		session,
		user,
		loading,
		signin,
		signout,
		setSessionValue,
		setUserValue,
	};
}
