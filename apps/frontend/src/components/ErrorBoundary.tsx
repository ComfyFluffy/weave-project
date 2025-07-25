import { Component, type ReactNode } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Box p={4} textAlign="center" bg="red.900" borderRadius="md">
          <Text color="red.200" mb={4}>
            出现了一个错误
          </Text>
          <Text color="red.300" fontSize="sm" mb={4}>
            {this.state.error?.message}
          </Text>
          <Button
            size="sm"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            重试
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
