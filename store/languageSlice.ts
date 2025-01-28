import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { i18n } from "../localization/localConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "./store";

interface LanguageState {
    isEnglish: boolean;
    locale: string;
}

const initialState: LanguageState = {
    isEnglish: i18n.locale === "en",
    locale: i18n.locale,
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        toggleLanguages(state) {
            state.isEnglish = !state.isEnglish;
            state.locale = state.isEnglish ? "en" : "de";
            i18n.locale = state.locale;
        },
        updateLocale(state, action: PayloadAction<string>) {
            AsyncStorage.setItem("languagePreference", action.payload);
            state.locale = action.payload;
            state.isEnglish = action.payload === "en";
            i18n.locale = action.payload; // Update the i18n locale
        },
    },
});

export const { toggleLanguages, updateLocale } = languageSlice.actions;
export default languageSlice.reducer;
