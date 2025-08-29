// slices/eventSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/services/event";

interface EventState {
  events: Event[]; // all public events
  myEvents: Event[]; // events created by current user
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  myEvents: [],
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
    fetchMyEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.loading = false;
      state.myEvents = action.payload;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    deleteMyEventSuccess: (state, action: PayloadAction<string>) => {
      // remove deleted event from myEvents
      state.myEvents = state.myEvents.filter((ev) => ev.id !== action.payload);
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchAllSuccess,
  fetchMyEventsSuccess,
  fetchFailure,
  clearCurrentEvent,
  deleteMyEventSuccess,
} = eventSlice.actions;

export default eventSlice.reducer;
