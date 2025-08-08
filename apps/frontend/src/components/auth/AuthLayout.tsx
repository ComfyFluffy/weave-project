import { Box, Flex } from '@chakra-ui/react'
import { SharedBackground } from './SharedBackground'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-b, #0f0c29, #302b63, #24243e)"
    >
      <SharedBackground />

      <Box
        width="100%"
        maxWidth="400px"
        bg="rgba(30, 30, 46, 0.8)"
        borderRadius="xl"
        boxShadow="xl"
        p={8}
        position="relative"
        zIndex={1}
        backdropFilter="blur(10px)"
        border="1px solid rgba(100, 149, 237, 0.2)"
      >
        {children}
      </Box>
    </Flex>
  )
}
