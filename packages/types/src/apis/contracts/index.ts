import { initContract } from '@ts-rest/core'
import { authContract } from './auth'
import { messageContract } from './message'
import { worldStateContract } from './world-state'
import { worldContract } from './world'
import { characterContract } from './character'
import { commonResponses } from '../common'

const c = initContract()

export const contract = c.router(
  {
    auth: authContract,
    character: characterContract,
    message: messageContract,
    worldState: worldStateContract,
    world: worldContract,
  },
  {
    commonResponses,
  }
)

export * from './auth'
export * from './character'
export * from './message'
export * from './world-state'
export * from './world'
