import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// --------------------
// Types
// --------------------
export type Role = "ADMIN" | "ORGANIZER" | "PARTICIPANT";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  profilePic: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// --------------------
// Initial State
// --------------------
const initialState: AuthState = {
  user: null,
  loading: true,
};

// --------------------
// Async Thunks
// --------------------
export const fetchMe = createAsyncThunk<User>("auth/me", async () => {
  const { data } = await api.get<{ user: User }>("/user/me");
  return data.user;
});

// --------------------
// Slice
// --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

// --------------------
// Exports
// --------------------
export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
