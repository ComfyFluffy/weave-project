import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useAuth } from '../../providers/AuthProvider'

export function AuthFlow() {
  const [isLogin, setIsLogin] = useState(true)

  const handleLoginSuccess = () => {
    // Redirect to the main app
    window.location.reload()
  }

  const handleRegisterSuccess = () => {
    // Switch to login form after successful registration
    setIsLogin(true)
  }

  const switchToLogin = () => {
    setIsLogin(true)
  }

  const switchToRegister = () => {
    setIsLogin(false)
  }

  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
      p={4}
    >
      <Box
        width="100%"
        maxWidth="400px"
        bg="gray.800"
        borderRadius="xl"
        boxShadow="xl"
        p={8}
      >
        {isLogin ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </Box>
    </Flex>
  )
}
