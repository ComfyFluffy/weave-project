import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Alert,
  Popover,
  IconButton,
  Portal,
  Textarea,
  Collapsible,
} from '@chakra-ui/react'
import { Sparkles, Copy, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import {
  getNarratorSuggestions,
  getPlayerSuggestions,
  type AISuggestionResponse,
} from '../services/aiService'

interface AISuggestionsModalProps {
  worldId: string
  channelId: string
  mode: 'narrator' | 'player'
  characterName?: string
  onUseSuggestion: (suggestion: string) => void
}

export function AISuggestionsModal({
  worldId,
  channelId,
  mode,
  characterName,
  onUseSuggestion,
}: AISuggestionsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestionResponse | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [customInstruction, setCustomInstruction] = useState('')
  const [showInstructionInput, setShowInstructionInput] = useState(false)

  const handleRequestSuggestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const instruction = customInstruction.trim() || undefined
      const response =
        mode === 'narrator'
          ? await getNarratorSuggestions(worldId, channelId, instruction)
          : await getPlayerSuggestions(worldId, channelId, characterName, instruction)
      setSuggestions(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取AI建议失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseSuggestion = (suggestion: string) => {
    onUseSuggestion(suggestion)
    setIsOpen(false)
    setSuggestions(null)
  }

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
    setSuggestions(null)
    setCustomInstruction('')
    setShowInstructionInput(false)
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Popover.Trigger asChild>
        <IconButton
          size="sm"
          variant="ghost"
          color="purple.400"
          _hover={{ color: 'purple.300', bg: 'purple.900' }}
          onClick={handleOpen}
        >
          <Sparkles size={16} />
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width="600px"
            bg="gray.800"
            borderColor="gray.600"
            overflow="auto"
          >
            <Popover.Header>
              <Sparkles size={20} color="#a855f7" />
              <Text fontWeight="bold" color="white">
                {mode === 'narrator' ? 'AI 主持人助手' : 'AI 行动建议'}
                {characterName && mode === 'player' && ` - ${characterName}`}
              </Text>
              <Popover.CloseTrigger />
            </Popover.Header>

            <Popover.Body>
              {!suggestions && !isLoading && (
                <VStack gap={4}>
                  <Text color="gray.300" textAlign="center">
                    {mode === 'narrator'
                      ? '基于当前游戏情况，AI将为你生成3个不同风格的剧情发展建议'
                      : '基于当前游戏情况，AI将为你生成3个不同类型的行动建议'}
                  </Text>

                  {/* Custom Instruction Section */}
                  <Box width="100%">
                    <Collapsible.Root open={showInstructionInput}>
                      <Collapsible.Trigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          color="gray.400"
                          _hover={{ color: 'white' }}
                          onClick={() => setShowInstructionInput(!showInstructionInput)}
                          width="100%"
                          justifyContent="space-between"
                        >
                          <Text>自定义指令 (可选)</Text>
                          {showInstructionInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </Collapsible.Trigger>
                      
                      <Collapsible.Content>
                        <Box mt={3}>
                          <Textarea
                            value={customInstruction}
                            onChange={(e) => setCustomInstruction(e.target.value)}
                            placeholder={
                              mode === 'narrator'
                                ? '例如：请生成一些与魔法相关的剧情发展，注重角色间的对话互动...'
                                : '例如：我想要一些潜行和调查相关的行动建议，避免直接冲突...'
                            }
                            rows={3}
                            bg="gray.700"
                            borderColor="gray.600"
                            color="white"
                            _placeholder={{ color: 'gray.500' }}
                            _focus={{ borderColor: 'purple.400' }}
                            resize="vertical"
                          />
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            描述你希望AI关注的特定方面或风格偏好
                          </Text>
                        </Box>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  </Box>

                  <Button
                    onClick={handleRequestSuggestions}
                    colorScheme="purple"
                    size="lg"
                    loading={isLoading}
                    loadingText="正在生成建议..."
                  >
                    <Sparkles size={16} />
                    {mode === 'narrator' ? '获取剧情建议' : '获取行动建议'}
                  </Button>
                </VStack>
              )}

              {isLoading && (
                <VStack gap={4} py={8}>
                  <Spinner size="lg" color="purple.400" />
                  <Text color="gray.300">AI正在分析当前情况并生成建议...</Text>
                </VStack>
              )}

              {error && (
                <Alert.Root status="error" variant="surface">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>获取建议失败</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              {suggestions && (
                <VStack gap={4} align="stretch">
                  {suggestions.reasoning && (
                    <Box
                      p={3}
                      bg="gray.700"
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="purple.400"
                    >
                      <Text fontSize="sm" color="gray.300">
                        <Text as="span" fontWeight="bold" color="purple.300">
                          AI分析：
                        </Text>
                        {suggestions.reasoning}
                      </Text>
                    </Box>
                  )}

                  <VStack gap={3} align="stretch">
                    {suggestions.suggestions.map((suggestion, index) => (
                      <Box
                        key={index}
                        p={4}
                        bg="gray.700"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.600"
                        _hover={{ borderColor: 'purple.400' }}
                        transition="border-color 0.2s"
                      >
                        <Text color="white" mb={3} lineHeight="1.6">
                          {suggestion}
                        </Text>

                        <HStack justify="flex-end" gap={2}>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="gray.400"
                            _hover={{ color: 'white' }}
                            onClick={() => handleCopySuggestion(suggestion)}
                          >
                            <Copy size={14} />
                            复制
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="purple"
                            onClick={() => handleUseSuggestion(suggestion)}
                          >
                            <Send size={14} />
                            使用此建议
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              )}
            </Popover.Body>

            <Popover.Footer>
              {suggestions && (
                <Button
                  onClick={handleRequestSuggestions}
                  loading={isLoading}
                  loadingText="重新生成中..."
                  colorScheme="purple"
                >
                  重新生成
                </Button>
              )}
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
