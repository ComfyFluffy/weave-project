/**
 * Request/Response type definitions for the Weave platform
 *
 * This module contains types used for API requests, authentication,
 * and other client-server communication.
 */

export * from './requests'
export * from './contracts'
import { z } from 'zod'

export const ErrorResponseSchema = z.object({
  message: z.string().default('Error!').optional(),
})
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
