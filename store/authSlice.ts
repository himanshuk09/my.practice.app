import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize state based on AsyncStorage
const initialState = {
  value: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state) => {
      state.value = true;
      AsyncStorage.setItem("isLoggedIn", "true");
    },
    logout: (state) => {
      state.value = false;
      AsyncStorage.removeItem("isLoggedIn");
    },
    setInitialState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUser, logout, setInitialState } = authSlice.actions;

export default authSlice.reducer;
