import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import languageReducer from "./languageSlice";
import navigationReducer from "./navigationSlice";
import chartDataFilterReducer from "./chartDataFilterToggle";
import drawerReducer from "./drawerSlice";
export const store = configureStore({
  reducer: {
    auth: userReducer,
    language: languageReducer,
    navigation: navigationReducer,
    activeTabFilter: chartDataFilterReducer,
    drawer: drawerReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
