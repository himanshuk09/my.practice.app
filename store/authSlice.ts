import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize state based on AsyncStorage
const initialState = {
	value: false,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.value = true;
			state.user = action.payload;
			AsyncStorage.setItem("isLoggedIn", "true");
		},
		logout: (state) => {
			state.value = false;
		},
		setInitialState: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setUser, logout, setInitialState } = authSlice.actions;

export default authSlice.reducer;
