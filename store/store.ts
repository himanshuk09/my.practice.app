import authReducer from "./authSlice";
import drawerReducer from "./drawerSlice";
import orientationReducer from "./chartSlice";
import languageReducer from "./languageSlice";
import navigationReducer from "./navigationSlice";
import networkReducer from "./networkSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		drawer: drawerReducer,
		network: networkReducer,
		culture: languageReducer,
		navigation: navigationReducer,
		orientation: orientationReducer,
	},
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
