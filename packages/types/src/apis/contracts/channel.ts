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

export const CreateChannelRequestSchema = z.object({
  worldId: z.string(),
  name: z.string().min(1),
  type: z.enum(['ooc', 'ic', 'announcement']),
  description: z.string(),
})
export type CreateChannelRequest = z.infer<typeof CreateChannelRequestSchema>

export const channelContract = c.router(
  {
    getChannelsByWorldId: {
      method: 'GET',
      path: '/world/:worldId',
      responses: {
        200: ChannelsResponseSchema,
      },
    },
    createChannel: {
      method: 'POST',
      path: '/',
      body: CreateChannelRequestSchema,
      responses: {
        201: ChannelSingleResponseSchema,
      },
    },
    deleteChannel: {
      method: 'DELETE',
      path: '/:channelId',
      responses: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
  },
  {
    pathPrefix: '/channels',
    commonResponses,
  }
)
