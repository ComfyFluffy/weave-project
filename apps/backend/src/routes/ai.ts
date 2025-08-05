import express from 'express'
import { Message, streamText } from 'ai'
import { openai } from '../services/aiService'
import { DatabaseService } from '../services/database.interface'

export function createAIRoutes(dbService: DatabaseService) {
  const router = express.Router()

  // AI Chat endpoint using AI SDK streaming
  router.post('/chat', async (req, res) => {
    try {
      const {
        messages: userMessages,
        worldId,
        channelId,
        characterId,
        role: playerRole,
      } = req.body as {
        messages: Message[]
        worldId: string
        channelId: string
        characterId: string
        role: string
      }

      // Get world context using the database service
      const worldData = worldId ? await getWorldState(dbService, worldId) : null
      const recentMessages = channelId
        ? await getChannelMessages(dbService, channelId, 20)
        : []

      // Build context for AI
      const contextMessages: Message[] = []

      // System message with world context
      const systemContext = buildSystemContext(
        worldData,
        recentMessages,
        playerRole,
        characterId
      )
      contextMessages.push({
        id: 'system',
        role: 'system',
        content: systemContext,
      })

      // Add user messages
      contextMessages.push(...userMessages)

      console.log('AI chat context messages:', contextMessages)

      const result = streamText({
        model: openai,
        messages: contextMessages,
        temperature: 0.7,
      })
      void (async () => {
        for await (const chunk of result.textStream) {
          process.stdout.write(chunk)
        }
        console.log('\nStream completed.')
      })()

      result.pipeDataStreamToResponse(res)
    } catch (error) {
      console.error('AI chat error:', error)
      res.status(500).json({ error: 'Failed to process AI chat request' })
    }
  })

  return router
}

// Helper functions to use database service
async function getWorldState(dbService: DatabaseService, worldId: string) {
  const worldStates = await dbService.getWorldStatesByWorldId(worldId)
  return worldStates[0] || null
}

async function getChannelMessages(
  dbService: DatabaseService,
  channelId: string,
  limit: number = 20
) {
  return await dbService.getMessagesByChannelId(channelId, limit)
}

function buildSystemContext(
  worldData: any,
  recentMessages: any[],
  role: string,
  characterId?: string
) {
  return `你是一个专业的桌游助手，帮助玩家和游戏主持人管理和探索游戏世界。

角色信息：
- 当前用户角色: ${role === 'gm' ? '游戏主持人 (GM)' : role === 'player' ? '玩家' : '观察者'}
${characterId ? `- 当前角色ID: ${characterId}` : ''}

游戏世界数据：
${worldData ? JSON.stringify(worldData, null, 2) : '暂无世界数据'}

最近的聊天记录：
${
  recentMessages.length > 0
    ? recentMessages
        .map((msg) => `${msg.characterName || 'User'}: ${msg.content}`)
        .join('\n')
    : '暂无聊天记录'
}

请基于以上信息回答用户的问题，提供有用的建议和信息。如果用户询问游戏规则、角色状态、世界设定等，请基于提供的数据进行回答。`
}
