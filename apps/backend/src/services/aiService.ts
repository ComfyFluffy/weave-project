import { createOpenAI } from '@ai-sdk/openai'
import { createProviderRegistry, streamText } from 'ai'

export const registry = createProviderRegistry({
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  }),
})

export const openai = registry.languageModel(
  `openai:${process.env.OPENAI_MODEL || 'gpt-4o'}`
)

// Test
console.log('OpenAI model initialized:', openai)
;(async () => {
  const { textStream } = streamText({
    model: openai,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'How is the climate in France?' },
    ],
    maxRetries: 1,
    maxTokens: 100,
  })

  for await (const chunk of textStream) {
    process.stdout.write(chunk)
  }
  console.log('\nStream completed.')
})()
