// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { api } from "../../services/api";

// // --------------------
// // Types
// // --------------------
// export type Role = "ADMIN" | "ORGANIZER" | "PARTICIPANT";

// export interface User {
//   id: string;
//   email: string;
//   fullName: string;
//   phone: string | null;
//   role: Role;
//   profilePic: string | null;
// }

// export interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// // --------------------
// // Initial State
// // --------------------
// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// // --------------------
// // Async Thunks
// // --------------------
// export const fetchMe = createAsyncThunk<User>("auth/me", async () => {
//   const { data } = await api.get<{ user: User }>("/user/me");
//   return data.user;
// });

// // --------------------
// // Slice
// // --------------------
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User | null>) => {
//       state.user = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     clearUser: (state) => {
//       state.user = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMe.pending, (state) => {
//         state.loading = true;
//         state.error = null; // reset error when retrying
//       })
//       .addCase(fetchMe.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchMe.rejected, (state, action) => {
//         state.loading = false;
//         state.user = null;
//         state.error = action.error.message || "Failed to fetch user";
//       });
//   },
// });

// // --------------------
// // Exports
// // --------------------
// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer;
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
  error: string | null;
}

// --------------------
// Helpers
// --------------------
const loadUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// --------------------
// Initial State
// --------------------
const initialState: AuthState = {
  user: loadUserFromStorage(),
  loading: false,
  error: null,
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
      state.error = null;

      // persist to storage
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;

        // persist fetched user
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message || "Failed to fetch user";
        localStorage.removeItem("user");
      });
  },
});

// --------------------
// Exports
// --------------------
export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;