import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import events from "./slices/eventSlice";
import participants from "./slices/participantSlice";

export const store = configureStore({
  reducer: { auth, events, participants },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
