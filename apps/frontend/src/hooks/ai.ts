import { useChat } from '@ai-sdk/react'

const API_BASE_URL = 'http://localhost:3001/api'

export const useWorldChat = (
  worldId: string,
  channelId: string,
  selectedCharacterId?: string,
  selectedRole?: string
) =>
  useChat({
    api: `${API_BASE_URL}/ai/chat`,
    body: {
      worldId,
      channelId,
      characterId: selectedCharacterId,
      role: selectedRole,
    },
    // 添加错误处理
    onError: (error) => {
      console.error('AI chat error:', error)
      // 重新抛出错误以便在组件中捕获
      throw error
    },
    fetch: async (url, options) => {
      try {
        const response = await fetch(url, options)
        
        // 检查响应状态码
        if (!response.ok) {
          // 尝试解析错误信息
          let errorMessage = ''
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || `请求失败 (${response.status})`
          } catch (e) {
            // 如果无法解析JSON，使用状态码作为错误信息
            errorMessage = `请求失败 (${response.status} ${response.statusText})`
          }
          
          // 创建新的错误对象，包含服务器返回的错误信息
          const error = new Error(errorMessage)
          error.name = 'AIChatError'
          throw error
        }
        
        return response
      } catch (error) {
        // 如果是网络错误或其他类型的错误，直接抛出
        if (error instanceof Error && error.name !== 'AIChatError') {
          const networkError = new Error('网络错误，请检查网络连接')
          networkError.name = 'NetworkError'
          throw networkError
        }
        throw error
      }
    },
  })
