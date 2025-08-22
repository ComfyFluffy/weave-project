import { initContract } from '@ts-rest/core'
import { authContract } from './auth'
import { channelContract } from './channel'
import { messageContract } from './message'
import { worldStateContract } from './world-state'
import { worldContract } from './world'
import { characterContract } from './character'
import { userContract } from './user'
import { commonResponses } from '../common'

const c = initContract()

export const contract = c.router(
  {
    auth: authContract,
    channel: channelContract,
    character: characterContract,
    message: messageContract,
    user: userContract,
    worldState: worldStateContract,
    world: worldContract,
  },
  {
    commonResponses,
  }
)

export * from './auth'
export * from './channel'
export * from './character'
export * from './message'
export * from './user'
export * from './world-state'
export * from './world'
