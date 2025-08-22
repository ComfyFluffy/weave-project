import { initContract } from '@ts-rest/core'
import z from 'zod'
import { ChannelSchema } from '../..'
import { commonResponses } from '../common'
const c = initContract()

export const ChannelsResponseSchema = z.object({
  channels: z.array(ChannelSchema),
})
export type ChannelsResponse = z.infer<typeof ChannelsResponseSchema>

export const ChannelSingleResponseSchema = z.object({
  channel: ChannelSchema,
})
export type ChannelSingleResponse = z.infer<typeof ChannelSingleResponseSchema>

export const channelContract = c.router(
  {
    getChannelsByWorldId: {
      method: 'GET',
      path: '/world/:worldId',
      responses: {
        200: ChannelsResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/channels',
    commonResponses,
  }
)
