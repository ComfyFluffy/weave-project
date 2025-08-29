import {
  World as PrismaWorld,
  Channel as PrismaChannel,
  User as PrismaUser,
  Character as PrismaCharacter,
  WorldState as PrismaWorldState,
  Message as PrismaMessage,
} from '../generated/prisma'
import type {
  World,
  Channel,
  User,
  PublicUser,
  Character,
  WorldState,
  Message,
} from '@weave/types'

export const mapWorld = ({
  id,
  name,
  description,
  tags,
  rules,
  channels,
}: PrismaWorld & { channels: PrismaChannel[] }): World => ({
  id,
  name,
  description,
  tags,
  rules: rules ?? undefined,
  channels: channels.map(mapChannel),
})

export const mapChannel = ({
  id,
  worldId,
  name,
  type,
  description,
  worldStateId,
}: PrismaChannel): Channel => ({
  id,
  worldId,
  name,
  type,
  description,
  worldStateId: worldStateId ?? undefined,
})

export const mapUser = ({
  id,
  email,
  displayName,
  avatar,
}: PrismaUser): User => ({
  id,
  email,
  displayName,
  avatar: avatar ?? undefined,
})

export const mapPublicUser = ({
  id,
  displayName,
  avatar,
}: PrismaUser): PublicUser => ({
  id,
  displayName,
  avatar: avatar ?? undefined,
})

export const mapCharacter = ({
  id,
  name,
  description,
  avatar,
}: PrismaCharacter): Character => ({
  id,
  name,
  description,
  avatar: avatar ?? undefined,
})

export const mapWorldState = ({
  id,
  worldId,
  state,
}: PrismaWorldState): WorldState => ({
  id,
  worldId,
  state: state as WorldState['state'],
  characters: [], // This would need to be populated from the state or database
})

export const mapMessage = ({
  id,
  channelId,
  userId,
  characterId,
  type,
  content,
  createdAt,
  updatedAt,
}: PrismaMessage): Message => ({
  id,
  channelId,
  userId: userId ?? undefined,
  characterId: characterId ?? undefined,
  type,
  content,
  createdAt,
  updatedAt,
})
