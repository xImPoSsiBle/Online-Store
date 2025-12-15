import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  email: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  username: null,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        username: string;
      }>
    ) {
      console.log("auth: ", action.payload);
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.username = action.payload.username

      AsyncStorage.setItem('accessToken', action.payload.accessToken);
      AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
      AsyncStorage.setItem('username', action.payload.username);
    },

    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload
    },

    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { loginSuccess, logout, setUsername } = authSlice.actions;
export default authSlice.reducer;

