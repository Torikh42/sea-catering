import { z } from "zod";
import { isBefore, startOfDay } from "date-fns";

export const PauseSubscriptionSchema = z
  .object({
    subscriptionId: z.string().min(1, "ID langganan tidak valid."),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => !isBefore(data.endDate, data.startDate), {
    message: "Tanggal akhir jeda tidak boleh sebelum tanggal mulai jeda.",
    path: ["endDate"],
  })
  .refine((data) => !isBefore(data.startDate, startOfDay(new Date())), {
    message: "Tanggal mulai jeda tidak boleh di masa lalu.",
    path: ["startDate"],
  });
