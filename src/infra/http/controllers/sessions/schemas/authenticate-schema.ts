import { z } from 'zod'

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
