import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrientationState {
	isLandscape: boolean;
}

const initialState: OrientationState = {
	isLandscape: false,
};

const orientationSlice = createSlice({
	name: "orientation",
	initialState,
	reducers: {
		// Action to update the orientation state
		setOrientation(state, action: PayloadAction<boolean>) {
			state.isLandscape = action.payload;
		},
	},
});

export const { setOrientation } = orientationSlice.actions;

export default orientationSlice.reducer;
