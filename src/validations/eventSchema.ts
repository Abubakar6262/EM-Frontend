import * as Yup from "yup";

export const EventSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  type: Yup.string().oneOf(["ONLINE", "ONSITE"]).required("Type is required"),

  contactInfo: Yup.string()
    .required("Contact Info is required")
    .min(3, "Contact info must be at least 3 characters"),

  thumbnail: Yup.mixed().required("Thumbnail is required"),

  venue: Yup.string().when("type", {
    is: "ONSITE",
    then: (schema) => schema.required("Venue is required for onsite events"),
    otherwise: (schema) => schema.optional(),
  }),

  joinLink: Yup.string().when("type", {
    is: "ONLINE",
    then: (schema) =>
      schema
        .required("Join link is required for online events")
        .url("Must be a valid URL"),
    otherwise: (schema) => schema.optional(),
  }),

  startAt: Yup.date()
    .typeError("Start date is required")
    .required("Start date is required"),

  endAt: Yup.date()
    .typeError("End date is required")
    .required("End date is required")
    .test(
      "endAfterStart",
      "End date must be after start date",
      function (value) {
        return value && this.parent.startAt
          ? new Date(value) > new Date(this.parent.startAt)
          : true;
      }
    ),

  hosts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Host name required"),
      email: Yup.string().email("Invalid email").optional(),
      phone: Yup.string().optional(),
      userId: Yup.string().uuid("Invalid userId").optional(),
    })
  ),

  organizerIds: Yup.array(Yup.string().uuid("Invalid organizer id")).optional(),

  totalSeats: Yup.mixed()
    .transform((val) => (val !== "" ? Number(val) : undefined))
    .nullable(),
});
