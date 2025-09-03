import { WorldState, CharacterState } from '@weave/types'

export const defaultWorldState: () => WorldState['state'] = () => ({
  keyEventsLog: [],
  characterStates: {},
  locations: [],
  items: {},
  plots: [],
  lore: [],
  currentGameTime: '',
})

export const defaultCharacterState: () => CharacterState = () => ({
  currentLocationName: '',
  inventory: [],
  stats: {
    health: { current: 100, max: 100 },
    mana: { current: 50, max: 50 },
  },
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  properties: {},
  knowledge: {},
  goals: {},
  secrets: {},
  discoveredLores: [],
})
