import { initContract } from '@ts-rest/core'
import z from 'zod'
import { MessageSchema } from '../..'
import { commonResponses } from '../common'
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
      },
    },
  },
  {
    pathPrefix: '/messages',
    commonResponses,
  }
)
