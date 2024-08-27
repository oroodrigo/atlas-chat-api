import { z } from 'zod'

export const newChatBodySchema = z.object({
  name: z.string().min(4),
})

export type NewChatBodySchema = z.infer<typeof newChatBodySchema>
