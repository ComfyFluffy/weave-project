import { WorldState } from '@weave/types'

export const defaultWorldState: () => WorldState['state'] = () => ({
  keyEventsLog: [],
  characterStates: {},
  locations: [],
  items: {},
  itemTemplates: [],
  plots: [],
  lore: [],
  currentGameTime: '',
})
