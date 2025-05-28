import { i18n } from "@/localization/config";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguageState {
	locale: string | "en" | "de";
}

const initialState: LanguageState = {
	locale: i18n.locale,
};

const languageSlice = createSlice({
	name: "culture",
	initialState,
	reducers: {
		updateLocale(state, action: PayloadAction<string>) {
			AsyncStorage.setItem("culture", action.payload);
			state.locale = action.payload;
			i18n.locale = action.payload; // Update the i18n locale
		},
	},
});

export const { updateLocale } = languageSlice.actions;
export default languageSlice.reducer;
