import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobileMenuOpen: false,
  selectedLanguage: "en",
  isLoading: false,
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  setLanguage,
  setLoading,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
