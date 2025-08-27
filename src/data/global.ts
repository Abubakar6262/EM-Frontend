// data/global.ts
import { toast, ToastOptions } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warning" | "default";

const defaultOptions: ToastOptions = {
  position: "bottom-left",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const notify = (msg: string, type: ToastType = "default") => {
  switch (type) {
    case "success":
      toast.success(msg, defaultOptions);
      break;
    case "error":
      toast.error(msg, defaultOptions);
      break;
    case "info":
      toast.info(msg, defaultOptions);
      break;
    case "warning":
      toast.warning(msg, defaultOptions);
      break;
    default:
      toast(msg, defaultOptions);
  }
};
