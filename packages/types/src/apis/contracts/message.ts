import { initContract } from '@ts-rest/core'
import z from 'zod'
import { ErrorResponseSchema } from '..'
import { MessageSchema } from '../..'
const c = initContract()

export const MessagesResponseSchema = z.object({
  messages: z.array(MessageSchema),
})
export type MessagesResponse = z.infer<typeof MessagesResponseSchema>

export const messageContract = c.router(
  {
    getMessagesByChannelId: {
      method: 'GET',
      path: '/channel/:channelId',
      responses: {
        200: MessagesResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/messages',
  }
)
