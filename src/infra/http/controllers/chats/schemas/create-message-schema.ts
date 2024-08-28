import { z } from 'zod'

export const createMessageBodySchema = z.object({
  content: z.string(),
})

export type CreateMessageBodySchema = z.infer<typeof createMessageBodySchema>
