// services/auth.ts
import { api } from "./api";

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "ORGANIZER" | "PARTICIPANT";
};
export interface UserProfileValues {
  fullName: string;
  email: string;
  role: string;
}
export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = { email: string };

// === New Interfaces for getMyUsers ===
export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "ORGANIZER" | "PARTICIPANT";
}

export interface GetMyUsers {
  success: boolean;
  users: UserItem[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export const authService = {
  signup: async (payload: SignupPayload) => {
    const { data } = await api.post("/auth/signup", payload);
    return data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await api.post("/auth/login", payload, {
      headers: { "x-skip-refresh": "true" },
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get("/user/me");
    return data;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const { data } = await api.post(`/auth/verify-reset?token=${token}`, {
      newPassword,
    });
    return data;
  },

  updateProfilePic: async (file: File) => {
    const formData = new FormData();
    formData.append("profilePic", file);

    const { data } = await api.put("/user/update-profile-pic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  updateUserInfo: async (payload: { fullName: string; phone: string }) => {
    const { data } = await api.put("/user/update-user-info", payload);
    return data;
  },

  updatePassword: async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const { data } = await api.put("/user/update-password", payload);
    return data;
  },

  // getMyUsers service
  getMyUsers: async (
    page = 1,
    limit = 10,
    search?: string
  ): Promise<GetMyUsers> => {
    const { data } = await api.get("/user/created-by-me", {
      params: { page, limit, search },
    });
    return data;
  },

  // createUser service
  createUser: async (payload: UserProfileValues): Promise<UserItem> => {
    const { data } = await api.post("/auth/create-user", payload);
    return data;
  },

  // Update user role

  updateRole: async (userId: string, role: string): Promise<UserItem> => {
    const { data } = await api.put(`/user/update-user-role`, {
      role,
      user: {
        id: userId,
      },
    });
    return data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/user/delete-user/${userId}`);
    
  },
};
