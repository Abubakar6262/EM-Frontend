import { api } from "./api";

// --------------------
// Types
// --------------------
export interface ParticipantUser {
  id: string;
  fullName: string;
  email: string;
}

export type ParticipantStatus = "PENDING" | "APPROVED" | "DECLINED";

export interface Participant {
  id: string;
  user: ParticipantUser;
  eventId: string;
  status: ParticipantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  type: string;
  joinLink: string;
  venue: string;
}

export interface ParticipantEvent {
  id: string;
  userId: string;
  eventId: string;
  status: ParticipantStatus;
  createdAt: string;
  event: EventData;
  user: ParticipantUser;
}

export interface PaginatedParticipantResponse {
  participants: ParticipantEvent[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// --------------------
// Service
// --------------------
export const participantService = {
  // Join an event
  join: async (eventId: string): Promise<Participant> => {
    const { data } = await api.post("/participant/join", { eventId });
    return data.data;
  },

  // Update participant status (approve/decline etc.)
  updateStatus: async (
    participantId: string,
    status: ParticipantStatus
  ): Promise<Participant> => {
    const { data } = await api.patch(`/participant/${participantId}/status`, {
      status,
    });
    return data.data;
  },

  // Delete (cancel participation)
  delete: async (
    participantId: string
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/participant/${participantId}`);
    return data;
  },

  // Get my join requests (array only)
  myRequests: async (): Promise<Participant[]> => {
    const { data } = await api.get("/participant/my-requests");
    return data.data;
  },

  // Get paginated join requests
  getAllJoinRequests: async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: ParticipantStatus
  ): Promise<PaginatedParticipantResponse> => {
    const params: {
      page: number;
      limit: number;
      status?: ParticipantStatus;
    } = { page, limit };

    if (status) params.status = status;

    const { data } = await api.get<PaginatedParticipantResponse>(
      `/participant/my-requests`,
      { params }
    );

    return data;
  },

  // Get my join requests (array only)
  deleteMyRequest: async (participantId: string): Promise<Participant[]> => {
    const { data } = await api.delete(`/participant/${participantId}`);
    return data.data;
  },

  // as organizer get my requests
  getOrganizerRequests: async (
    page: number,
    limit: number
  ): Promise<PaginatedParticipantResponse> => {
    const { data } = await api.get(`/participant/related/organizer`, {
      params: { page, limit },
    });
    return data;
  },

  //  NEW: approve / reject
  updateRequestStatus: async (
    requestId: string,
    status: "APPROVED" | "REJECTED"
  ): Promise<void> => {
    await api.put(`/participant/${requestId}/status`, { status });
  },
};
