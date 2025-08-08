import { Box, Flex } from '@chakra-ui/react'
import { LoginForm } from './LoginForm'
import { useNavigate } from 'react-router-dom'
import { SharedBackground } from './SharedBackground'

export function LoginRoute() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    // Redirect to the main app
    void navigate('/app')
  }

  const handleSwitchToRegister = () => {
    void navigate('/auth/register')
  }

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
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      </Box>
    </Flex>
  )
}
