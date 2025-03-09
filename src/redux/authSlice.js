import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Initially no user
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserlogin: (state, action) => {
      state.user = action.payload; // Store user data
    },
    logoutUser: (state) => {
      state.user = null; // Clear user on logout
    },
  },
});

export const { setUserlogin, logoutUser } = authSlice.actions;
export default authSlice.reducer;
