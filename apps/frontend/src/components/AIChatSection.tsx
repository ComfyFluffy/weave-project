import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { useWorldChat } from '../services/aiService'

interface AIChatSectionProps {
  worldId: string
  channelId: string
  selectedCharacterId?: string
  selectedRole?: string
}

export function AIChatSection({
  worldId,
  channelId,
  selectedCharacterId,
  selectedRole,
}: AIChatSectionProps) {
  const { messages, sendMessage, status } = useWorldChat(
    worldId,
    channelId,
    selectedCharacterId,
    selectedRole
  )
  const [input, setInput] = useState('')

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null
          )}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage({ text: input })
            setInput('')
          }
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Say something..."
        />
        <button type="submit" disabled={status !== 'ready'}>
          Submit
        </button>
      </form>
    </>
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()

  return (
    <ChatMessages>
      <ChatMessages.List className="px-4 py-4 h-full overflow-y-auto">
        {messages.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            color="gray.400"
            fontSize="sm"
          >
            开始与 AI 对话，探索游戏世界...
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box key={index} mb={4}>
              <ChatMessage
                message={message}
                isLast={index === messages.length - 1}
                className="items-start"
              >
                <ChatMessage.Avatar>
                  <Box
                    width="32px"
                    height="32px"
                    borderRadius="full"
                    bg={message.role === 'user' ? 'blue.600' : 'green.600'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {message.role === 'user' ? '你' : 'AI'}
                  </Box>
                </ChatMessage.Avatar>
                <ChatMessage.Content isLoading={isLoading} append={append}>
                  <ChatMessage.Content.Markdown className="text-white prose prose-invert max-w-none" />
                </ChatMessage.Content>
              </ChatMessage>
            </Box>
          ))
        )}
      </ChatMessages.List>
    </ChatMessages>
  )
}
