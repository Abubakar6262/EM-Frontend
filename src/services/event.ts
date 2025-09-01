// services/event.ts
import { EventFormValues } from "@/app/dashboard/create-event/page";
import { api } from "./api";


// --------------------
// Types
// --------------------
export interface Organizer {
  id: string;
  fullName: string;
  email: string;
  role?: string; // optional if not always provided
}

// export interface Host {
//   id: string;
//   fullName: string;
//   role?: string;
// }
export interface Host {
  name: string;
  email: string;
}

export interface Attachment {
  id: string;
  url: string;
  type: string;
}

export interface Participant {
  id: string;
  userId: string;
  eventId: string; 
  status: "PENDING" | "JOINED" | "DECLINED";
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  venue?: string;
  joinLink?: string | null;
  thumbnail: string;
  contactInfo?: string;
  startAt: string;
  endAt: string;
  participants: Participant[];
  hosts: Host[];
  organizers: Organizer[];
  attachments: Attachment[];
  totalSeats?: number;
  confirmedCount: number;
}

export interface PaginatedEventsResponse {
  success: boolean;
  message: string;
  count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Event[];
}

export type CreateEventPayload = {
  title: string;
  description: string;
  type: string;
  venue?: string;
  joinLink?: string | null;
  thumbnail: string;
  startAt: string;
  endAt: string;
};
export interface AdminDashboardData {
  totalEvents: number;
  incomingEvents: number;
  pastEvents: number;
  ongoingEvents: number;
  cancelledEvents: number;
  totalParticipants: number;
  averageSeatsFilled: number;
  mostPopularEvent: {
    id: string;
    title: string;
    participantsCount: number;
  } | null; // in case no popular event exists
  pendingJoinRequests: number;
  approvalRate: number;
  onlineVsOnsite: {
    ONLINE: number;
    ONSITE: number;
  };
  eventsLast30Days: {
    [date: string]: number; // dynamic dates with event counts
  };
}

// --------------------
// Service
// --------------------
export const eventService = {
  create: async (payload: EventFormValues) => {
    const formData = new FormData();

    //  Required text fields
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("type", payload.type); // ONSITE / ONLINE
    formData.append("startAt", payload.startAt);
    formData.append("endAt", payload.endAt);
    formData.append("contactInfo", payload.contactInfo);

    // Conditional fields
    if (payload.venue) {
      formData.append("venue", payload.venue);
    }
    if (payload.joinLink) {
      formData.append("joinLink", payload.joinLink);
    }

    // Hosts (array of objects → stringify)
    if (payload.hosts && payload.hosts.length > 0) {
      formData.append("hosts", JSON.stringify(payload.hosts));
    }

    // totalSeats
    if (payload.totalSeats) {
      formData.append("totalSeats", String(payload.totalSeats));
    }

    // folder (for cloud storage path)
    if (payload.folder) {
      formData.append("folder", payload.folder || "Event_Management/Event");
    }

    //  Files
    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail); // required
    } else {
      throw new Error("Thumbnail is required");
    }

    if (payload.media && payload.media.length > 0) {
      payload.media.forEach((file) => {
        formData.append("media", file);
      });
    }

    //  API call
    const { data } = await api.post("/events/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  update: async (id: string, payload: EventFormValues) => {
    const formData = new FormData();

    // Required fields
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("type", payload.type);
    formData.append("startAt", payload.startAt);
    formData.append("endAt", payload.endAt);
    formData.append("contactInfo", payload.contactInfo);

    // Conditional fields
    if (payload.venue) formData.append("venue", payload.venue);
    if (payload.joinLink) formData.append("joinLink", payload.joinLink);

    // Hosts
    if (payload.hosts?.length) {
      formData.append("hosts", JSON.stringify(payload.hosts));
    }

    // totalSeats
    if (payload.limitedSeats && payload.totalSeats) {
      formData.append("totalSeats", String(payload.totalSeats));
    } else {
      formData.append("totalSeats", "");
    }

    // folder
    formData.append("folder", payload.folder || "Event_Management/Event");

    // Thumbnail (only append if new file chosen)
    if (payload.thumbnail instanceof File) {
      formData.append("thumbnail", payload.thumbnail);
    }

    // Media
    if (payload.media?.length) {
      payload.media.forEach((file) => {
        formData.append("media", file);
      });
    }

    // API call
    const { data } = await api.put(`/events/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 10,
    filterBy?: string,
    search?: string,
    type?: string
  ): Promise<PaginatedEventsResponse> => {
    const { data } = await api.get("/events/all", {
      params: { page, limit, filterBy, search, type },
    });
    return data;
  },

  getMyEvents: async (
    page: number = 1,
    limit: number = 10,
    filterBy?: string,
    search?: string,
    type?: string
  ): Promise<PaginatedEventsResponse> => {
    const { data } = await api.get("/events/my-events", {
      params: { page, limit, filterBy, search, type },
    });
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get(`/events/${id}`);
    return data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/delete/${id}`);
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    await api.delete(`/events/delete-attachment/${attachmentId}`);
  },
  // get admin dashboard
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const { data } = await api.get("/events/dashboard/analysis");
    return data.data;
  },
};
