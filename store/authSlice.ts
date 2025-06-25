import { LOCALSTORAGEKEYS } from "@/utils/messages";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthStatePro {
	loading: boolean;
	session: boolean;
	user: null;
}

const initialState: AuthStatePro = {
	loading: false,
	session: false,
	user: null,
};

const authSlicePro = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setSession: (state, action: PayloadAction<boolean>) => {
			state.session = action.payload;
			AsyncStorage.setItem(
				LOCALSTORAGEKEYS.SESSION,
				action?.payload.toString()
			);
		},
		setUser: (state, action: PayloadAction<null>) => {
			state.user = action.payload;
		},
		signIn: (state, action: PayloadAction<null>) => {
			state.session = true;
			state.user = action.payload;
		},
		signOut: (state) => {
			state.session = false;
			state.user = null;
		},
	},
});

export const { setLoading, setSession, setUser, signIn, signOut } =
	authSlicePro.actions;
export default authSlicePro.reducer;
