import { useState } from 'react'
import { VStack, Button } from '@chakra-ui/react'
import { CharacterListPanel } from './CharacterListPanel'
import { CharacterStatusPanel } from './CharacterStatusPanel.tsx'
import type { Character, CharacterState, Item, WorldState } from '@weave/types'

interface SelectedCharacter {
  id: string
  character: Character
  state: CharacterState
}

interface CharacterPanelProps {
  worldState: WorldState
  handleStatUpdate: (
    characterId: string,
    statName: string,
    newValue: number
  ) => void | Promise<void>
  handleCharacterInfoUpdate: (
    characterId: string,
    updates: Partial<Character>
  ) => void
  handleCharacterNumericFieldsUpdate: (
    characterId: string,
    updates: {
      currentLocation?: string
      inventoryCount?: number
      discoveredLoresCount?: number
    }
  ) => void
  handleCharacterPropertiesAndKnowledgeUpdate: (
    characterId: string,
    updates: {
      properties?: Record<string, string>
      knowledge?: Record<string, string[]>
    }
  ) => void
  handleCharacterGoalsUpdate: (
    characterId: string,
    updates: Record<string, string[]>
  ) => void
  handleCharacterSecretsUpdate: (
    characterId: string,
    updates: Record<string, string[]>
  ) => void
  handleItemNameUpdate: (itemKey: string, newName: string) => void
  handleAddItemToCharacterInventory: (characterId: string, item: Item) => void
  handleRemoveItemFromCharacterInventory: (
    characterId: string,
    itemKey: string
  ) => void
  handleItemPropertyUpdate: (
    itemKey: string,
    property: string,
    newValue: any
  ) => void
}

export function CharacterPanel({
  worldState,
  handleStatUpdate,
  handleCharacterInfoUpdate,
  handleCharacterNumericFieldsUpdate,
  handleCharacterPropertiesAndKnowledgeUpdate,
  handleCharacterGoalsUpdate,
  handleCharacterSecretsUpdate,
  handleItemNameUpdate,
  handleAddItemToCharacterInventory,
  handleRemoveItemFromCharacterInventory,
  handleItemPropertyUpdate,
}: CharacterPanelProps) {
  const [selectedCharacter, setSelectedCharacter] =
    useState<SelectedCharacter | null>(null)

  return (
    <VStack align="stretch" gap={3}>
      {selectedCharacter ? (
        <VStack align="stretch" gap={3}>
          <Button
            size="sm"
            colorPalette="gray"
            onClick={() => setSelectedCharacter(null)}
            width="fit-content"
          >
            ← 返回角色列表
          </Button>
          <CharacterStatusPanel
            character={selectedCharacter.character}
            state={selectedCharacter.state}
            items={worldState.state.items}
            onUpdateStat={handleStatUpdate}
            onUpdateCharacterInfo={handleCharacterInfoUpdate}
            onUpdateCharacterNumericFields={handleCharacterNumericFieldsUpdate}
            onUpdateCharacterPropertiesAndKnowledge={
              handleCharacterPropertiesAndKnowledgeUpdate
            }
            onUpdateCharacterGoals={handleCharacterGoalsUpdate}
            onUpdateCharacterSecrets={handleCharacterSecretsUpdate}
            onUpdateItemName={handleItemNameUpdate}
            onUpdateItemProperty={handleItemPropertyUpdate}
            onAddItemToCharacterInventory={handleAddItemToCharacterInventory}
            onRemoveItemFromCharacterInventory={
              handleRemoveItemFromCharacterInventory
            }
            itemTemplates={worldState.state.itemTemplates}
          />
        </VStack>
      ) : (
        <CharacterListPanel
          characters={worldState.characters}
          characterStates={worldState.state.characterStates || {}}
          onSelectCharacter={(characterId) => {
            const character = worldState.characters.find(
              (c) => c.id === characterId
            )
            if (character) {
              // For NPCs that don't have a detailed state, create a minimal state object
              const characterState: CharacterState = worldState.state
                .characterStates?.[characterId] || {
                id: characterId,
                currentLocationName: '',
                inventory: [],
                stats: {},
                attributes: {},
                properties: {},
                knowledge: {},
                goals: {},
                secrets: {},
                discoveredLores: [],
              }
              setSelectedCharacter({
                id: characterId,
                character,
                state: characterState,
              })
            }
          }}
        />
      )}
    </VStack>
  )
}
