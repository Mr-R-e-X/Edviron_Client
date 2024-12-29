import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  role: "Admin" | "School";
  school_id?: string;
}

interface AuthState {
  user: User | null;
  userExists: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  userExists: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.userExists = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      state.userExists = false;
    },
  },
});

export const { setUser, setLoading, resetUser } = authSlice.actions;

export default authSlice.reducer;
