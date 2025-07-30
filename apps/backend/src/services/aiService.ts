import { createOpenAI } from '@ai-sdk/openai'
import { createProviderRegistry, generateText, streamText } from 'ai'

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
streamText({
  model: openai,
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  onFinish: (text) => {
    console.log('AI response:', text)
  },
  onError: (error) => {
    console.error('Error during AI response:', error)
  },
  onChunk: (chunk) => {
    console.log('Received chunk:', chunk)
  },
  onAbort: () => {
    console.log('AI response aborted')
  },
  maxRetries: 1,
})
