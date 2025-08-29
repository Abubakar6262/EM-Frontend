import { notify } from "@/data/global";
import axios from "axios";

export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}


export function handleApiError(
  error: unknown,
  fallbackMessage = "Something went wrong"
) {
  console.error("API Error:", error);

  if (axios.isAxiosError(error) && error.response) {
    const backendMessage = error.response.data?.message;
    notify(backendMessage || fallbackMessage, "error");
  } else if (error instanceof Error) {
    notify(error.message, "error");
  } else {
    notify(fallbackMessage, "error");
  }
}

// Helper function for getting the initial of a name
export const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "U";


export const formatDateTimeLocal = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Convert to local timezone and slice
  return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};