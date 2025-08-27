import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/services/event";

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action: PayloadAction<Event>) => {
      state.loading = false;
      state.currentEvent = action.payload;
    },
    fetchAllSuccess: (state, action: PayloadAction<Event[]>) => {
      state.loading = false;
      state.events = action.payload;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchAllSuccess,
  fetchFailure,
  clearCurrentEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
