// services/auth.ts
import { api } from "./api";

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "ORGANIZER" | "PARTICIPANT";
};

export type LoginPayload = {
  email: string;
  password: string;
};

type ForgotPasswordPayload = { email: string };

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
    const { data } = await api.get("/auth/logout");
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
};
