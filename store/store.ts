import { configureStore } from "@reduxjs/toolkit";

import languageReducer from "./languageSlice";
import navigationReducer from "./navigationSlice";
import orientationReducer from "./chartSlice";
import drawerReducer from "./drawerSlice";
import authReducer from "./authSlice";
export const store = configureStore({
	reducer: {
		auth: authReducer,
		culture: languageReducer,
		navigation: navigationReducer,
		orientation: orientationReducer,
		drawer: drawerReducer,
	},
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
