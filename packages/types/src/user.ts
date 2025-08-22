import z from 'zod'

/**
 * User represents a person using the platform
 * Users can be players or game masters
 */
export const UserSchema = z.object({
  /** Unique identifier for the user */
  id: z.string(),
  /** Email address for authentication */
  email: z.string().email(),
  /** Display name of the user */
  displayName: z.string(),
  /** Optional avatar emoji or image URL */
  avatar: z.string().optional(),
})
export type User = z.infer<typeof UserSchema>

/**
 * Public user schema without sensitive information
 * Used for client-side display
 */
export const PublicUserSchema = z.object({
  /** Unique identifier for the user */
  id: z.string(),
  /** Display name of the user */
  displayName: z.string(),
  /** Optional avatar emoji or image URL */
  avatar: z.string().optional(),
})
export type PublicUser = z.infer<typeof PublicUserSchema>
