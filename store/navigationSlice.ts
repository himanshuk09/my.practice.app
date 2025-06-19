import { createSlice } from "@reduxjs/toolkit";

interface NavigationState {
	history: string[];
	loading: boolean;
}
// Initial state for the navigation history
const initialState: NavigationState = {
	history: [], // To store visited routes
	loading: false,
};

const navigationSlice = createSlice({
	name: "navigation",
	initialState,
	reducers: {
		addRouteToHistory: (state, action) => {
			if (state.history[state.history?.length - 1] !== action.payload) {
				state.history.push(action.payload);
			}
		},
		removeLastRoute: (state) => {
			state.history.pop();
		},
		resetHistory: (state) => {
			state.history = [];
		},
		toggleLoading: (state) => {
			state.loading = !state.loading;
		},
		activeLoading: (state) => {
			state.loading = true;
		},
		inActiveLoading: (state) => {
			state.loading = false;
		},
	},
});

export const {
	addRouteToHistory,
	removeLastRoute,
	resetHistory,
	toggleLoading,
	activeLoading,
	inActiveLoading,
} = navigationSlice.actions;

export default navigationSlice.reducer;
