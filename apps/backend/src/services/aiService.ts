import { createOpenAI } from '@ai-sdk/openai'
import { createProviderRegistry, generateText, tool } from 'ai'
import z from 'zod'

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
void (async () => {
  const result = await generateText({
    model: openai,
    prompt: 'What is the weather like in San Francisco?',
    maxRetries: 1,
    // maxTokens: 100,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        // eslint-disable-next-line @typescript-eslint/require-await
        execute: async ({ location }) => {
          const weather = {
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }

          console.log('Weather tool executed:', weather)
          return weather
        },
      }),
    },
    toolChoice: 'required',
  })

  // for await (const chunk of textStream) {
  //   process.stdout.write(chunk)
  // }
  console.log('\nStream completed.', result)
})()
