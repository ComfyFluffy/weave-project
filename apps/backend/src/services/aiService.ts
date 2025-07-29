import OpenAI from 'openai'
import type { WorldState, Message } from '@weave/types'

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o'

export interface AIContext {
  worldState: WorldState
  recentMessages: Message[]
  channelName: string
  customInstruction?: string
}

export interface AIResponse {
  suggestions: string[]
  reasoning?: string
}

/**
 * Generate AI suggestions for the narrator based on current game context
 */
export async function generateNarratorSuggestions(
  context: AIContext
): Promise<AIResponse> {
  const { worldState, recentMessages, channelName, customInstruction } = context

  // Format recent messages for context
  const messageHistory = recentMessages
    .slice(-10) // Last 10 messages for context
    .map((msg) => {
      const characterInfo = msg.characterName ? ` (${msg.characterName})` : ''
      return `${msg.authorName}${characterInfo}: ${msg.content}`
    })
    .join('\n')

  // Format world state for context
  const worldContext = `
世界信息:
- 名称: ${worldState.world_info.name}
- 描述: ${worldState.world_info.description}
- 类型: ${worldState.world_info.genre}
- 当前时间: ${worldState.world_info.current_time}
- 天气: ${worldState.world_info.weather}

活跃角色:
${Object.entries(worldState.characters)
  .map(
    ([id, char]) =>
      `- ${char.name} (${char.class}): HP ${char.hp}/${char.maxHp}, 位置: ${char.location}`
  )
  .join('\n')}

重要NPC:
${Object.entries(worldState.npc_status)
  .map(
    ([id, npc]) => `- ${npc.name}: ${npc.description}, 态度: ${npc.disposition}`
  )
  .join('\n')}

当前剧情:
${worldState.active_plots
  .map((plot) => `- ${plot.title}: ${plot.description} (状态: ${plot.status})`)
  .join('\n')}

最近事件:
${worldState.key_events_log
  .slice(-3)
  .map((event) => `- ${event.title}: ${event.description}`)
  .join('\n')}
  `.trim()

  const prompt = `你是一个经验丰富的桌面角色扮演游戏(TRPG)的游戏主持人助手。基于当前的游戏情况，为主持人提供3个不同风格的剧情发展建议。

游戏背景:
${worldContext}

频道: ${channelName}

最近的对话记录:
${messageHistory}

${customInstruction ? `\n特殊要求：\n${customInstruction}\n` : ''}

请根据以上信息，为主持人提供3个剧情发展建议，每个建议应该：
1. 符合当前的世界观和故事背景
2. 对玩家的行动做出合理回应
3. 风格各不相同
${customInstruction ? '4. 特别注意上述特殊要求，并在建议中体现相关元素' : ''}

请用以下JSON格式回复：
{
  "suggestions": [
    "建议1的具体内容",
    "建议2的具体内容",
    "建议3的具体内容"
  ],
  "reasoning": "简单说明这些建议的考虑因素"
}`

  console.log('AI Prompt:', prompt)
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的TRPG游戏主持人助手，擅长创造引人入胜的故事情节和角色互动。请始终用中文回复，并确保建议符合游戏的世界观。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8, // Slightly higher for creativity
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response) as AIResponse
      return parsed
    } catch (parseError) {
      // If JSON parsing fails, treat the response as a single suggestion
      return {
        suggestions: [response],
        reasoning: '基于当前游戏情况的AI建议',
      }
    }
  } catch (error) {
    console.error('Error generating AI suggestions:', error)

    // Return fallback suggestions
    return {
      suggestions: [
        '酒保托尼放下手中的酒杯，表情变得严肃："关于北边森林的事...确实有些不寻常。最近有几个冒险者进去后就再也没有出来。"',
        '就在这时，酒馆的门突然被推开，一个浑身湿透、神情慌张的年轻人跌跌撞撞地冲了进来，大声喊道："救命！森林里有怪物！"',
        '酒保犹豫了一下，然后示意你们靠近，压低声音说："如果你们真的对此感兴趣，我有一张古老的地图...但这件事不能让其他人知道。"',
      ],
      reasoning: 'AI服务暂时不可用，提供备用建议以确保游戏continuity',
    }
  }
}

/**
 * Generate AI suggestions for player actions based on current game context
 */
export async function generatePlayerSuggestions(
  context: AIContext,
  characterName?: string
): Promise<AIResponse> {
  const { worldState, recentMessages, channelName, customInstruction } = context

  // Format recent messages for context
  const messageHistory = recentMessages
    .slice(-10) // Last 10 messages for context
    .map((msg) => {
      const characterInfo = msg.characterName ? ` (${msg.characterName})` : ''
      return `${msg.authorName}${characterInfo}: ${msg.content}`
    })
    .join('\n')

  // Find the player's character if specified
  const playerCharacter = characterName
    ? Object.values(worldState.characters).find(
        (char) => char.name === characterName
      )
    : null

  // Format world state for context
  const worldContext = `
世界信息:
- 名称: ${worldState.world_info.name}
- 描述: ${worldState.world_info.description}
- 类型: ${worldState.world_info.genre}
- 当前时间: ${worldState.world_info.current_time}
- 天气: ${worldState.world_info.weather}

${
  playerCharacter
    ? `你的角色:
- 姓名: ${playerCharacter.name}
- 职业: ${playerCharacter.class}
- 生命值: ${playerCharacter.hp}/${playerCharacter.maxHp}
- 当前位置: ${playerCharacter.location}
- 装备: ${playerCharacter.inventory.join(', ')}
- 个人目标: ${playerCharacter.personal_goals.join(', ')}
`
    : ''
}

其他活跃角色:
${Object.entries(worldState.characters)
  .filter(([id, char]) => !characterName || char.name !== characterName)
  .map(
    ([id, char]) =>
      `- ${char.name} (${char.class}): HP ${char.hp}/${char.maxHp}, 位置: ${char.location}`
  )
  .join('\n')}

重要NPC:
${Object.entries(worldState.npc_status)
  .map(
    ([id, npc]) => `- ${npc.name}: ${npc.description}, 态度: ${npc.disposition}`
  )
  .join('\n')}

当前剧情:
${worldState.active_plots
  .map((plot) => `- ${plot.title}: ${plot.description} (状态: ${plot.status})`)
  .join('\n')}

最近事件:
${worldState.key_events_log
  .slice(-3)
  .map((event) => `- ${event.title}: ${event.description}`)
  .join('\n')}
  `.trim()

  const prompt = `你是一个经验丰富的桌面角色扮演游戏(TRPG)玩家助手。基于当前的游戏情况，为玩家提供3个不同类型的行动建议。

游戏背景:
${worldContext}

频道: ${channelName}

最近的对话记录:
${messageHistory}

请根据以上信息，为玩家提供3个行动建议。

${
  customInstruction
    ? customInstruction.trim()
    : `
每个建议应该：
1. 符合角色的性格和背景
2. 对当前情况做出合理回应
3. 推进个人目标或团队目标
4. 风格各不相同（如：对话互动、探索行动、战略思考）
5. 建议应该以第一人称的角度给出，就像玩家会说的话一样。
`
}

请用以下JSON格式回复：
{
  "suggestions": [
    "建议1的具体内容（第一人称描述行动或对话）",
    "建议2的具体内容（第一人称描述行动或对话）",
    "建议3的具体内容（第一人称描述行动或对话）"
  ],
  "reasoning": "简单说明这些建议的考虑因素"
}`

  console.log('Player AI Prompt:', prompt)
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的TRPG玩家助手，擅长根据角色背景和当前情况提供合适的行动建议。请始终用中文回复，建议要符合角色性格和游戏情境。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8, // Higher creativity for player actions
      max_tokens: 800,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response) as AIResponse
      return parsed
    } catch (parseError) {
      // If JSON parsing fails, treat the response as a single suggestion
      return {
        suggestions: [response],
        reasoning: '基于当前游戏情况的AI行动建议',
      }
    }
  } catch (error) {
    console.error('Error generating player AI suggestions:', error)

    // Return fallback suggestions based on character context
    const characterAction = playerCharacter
      ? `我作为${playerCharacter.name}，想要了解更多关于这个情况的信息。`
      : '我想仔细观察周围的环境，寻找可能的线索。'

    return {
      suggestions: [
        characterAction,
        '我想和其他队友商量一下接下来的行动计划。',
        '我保持警觉，准备应对可能出现的危险情况。',
      ],
      reasoning: 'AI服务暂时不可用，提供基础行动建议',
    }
  }
}

/**
 * Generate character dialogue based on NPC and context
 */
export async function generateNPCDialogue(
  npcName: string,
  context: AIContext,
  playerMessage: string
): Promise<string> {
  const { worldState } = context
  const npc = Object.values(worldState.npc_status).find(
    (n) => n.name === npcName
  )

  if (!npc) {
    return `${npcName}点了点头，但没有说什么特别的。`
  }

  const prompt = `作为NPC "${npc.name}"，根据以下信息回应玩家：

NPC信息：
- 姓名：${npc.name}
- 描述：${npc.description}
- 性格特征：${npc.personality_traits.join(', ')}
- 当前态度：${npc.disposition}
- 目标：${npc.goals.join(', ')}
- 知识：${npc.knowledge.join(', ')}

玩家说："${playerMessage}"

请生成一个符合这个NPC性格和背景的回应，保持角色的一致性。回应应该简洁、自然，并推进对话。`

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是一个TRPG游戏中的NPC，请根据角色设定进行roleplay。回应要简洁自然，符合角色性格。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return (
      completion.choices[0]?.message?.content ||
      `${npcName}沉思了一下，然后回应了你的问题。`
    )
  } catch (error) {
    console.error('Error generating NPC dialogue:', error)
    return `${npcName}点了点头："这确实是个有趣的问题..."`
  }
}
