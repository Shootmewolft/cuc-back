import { z } from "zod"

export const tableSchema = z.object({
  capacity: z.number().int().positive().min(1, { message: "Capacity must be at least 1" }),
  location: z.enum(["window", "terrace", "indoor", "vip room"]),
})
