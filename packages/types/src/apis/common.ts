import z from 'zod'

export const ErrorResponseSchema = z.object({
  message: z.string().optional(),
})
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

export const commonResponses = {
  400: ErrorResponseSchema,
  404: ErrorResponseSchema,
}
