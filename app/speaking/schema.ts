import { z } from "zod"

export const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  eventDetails: z.string().min(20, "Please provide more details about the event"),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
