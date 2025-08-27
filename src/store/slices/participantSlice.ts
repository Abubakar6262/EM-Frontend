import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Participant } from "@/services/participant";

interface ParticipantState {
  participants: Participant[];
  myRequests: Participant[];
  loading: boolean;
  error: string | null;
}

const initialState: ParticipantState = {
  participants: [],
  myRequests: [],
  loading: false,
  error: null,
};

const participantSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action: PayloadAction<Participant[]>) => {
      state.loading = false;
      state.participants = action.payload;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setMyRequests: (state, action: PayloadAction<Participant[]>) => {
      state.myRequests = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);
    },
    updateParticipant: (state, action: PayloadAction<Participant>) => {
      const idx = state.participants.findIndex(
        (p) => p.id === action.payload.id
      );
      if (idx !== -1) state.participants[idx] = action.payload;
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(
        (p) => p.id !== action.payload
      );
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setMyRequests,
  addParticipant,
  updateParticipant,
  removeParticipant,
} = participantSlice.actions;

export default participantSlice.reducer;
