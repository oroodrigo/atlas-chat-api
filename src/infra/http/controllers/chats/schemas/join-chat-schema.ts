import { z } from 'zod'

export const joinChatBodySchema = z.object({
  room_id: z.string().uuid(),
})

export type JoinChatBodySchema = z.infer<typeof joinChatBodySchema>
