import * as Yup from "yup";

export const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name is required").required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  subject: Yup.string()
    .min(3, "Subject is required")
    .required("Subject is required"),
  message: Yup.string()
    .min(10, "Message should be at least 10 characters")
    .required("Message is required"),
});
