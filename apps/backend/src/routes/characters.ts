import { initServer } from '@ts-rest/express'
import { characterContract } from '@weave/types/apis'

export function createCharacterRouter() {
  const s = initServer()
  return s.router(characterContract, {})
}
