import { Box, Flex } from '@chakra-ui/react'
import { RegisterForm } from './RegisterForm'
import { useNavigate } from 'react-router-dom'

export function RegisterRoute() {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    // Switch to login form after successful registration
    void navigate('/auth/login')
  }

  const handleSwitchToLogin = () => {
    void navigate('/auth/login')
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
      {/* 星空背景 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`
          linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `}
        backgroundSize="30px 30px"
        zIndex={0}
      />

      {/* 光效 */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        bgImage={`
          radial-gradient(circle at 30% 40%, rgba(100, 149, 237, 0.2) 0%, transparent 20%),
          radial-gradient(circle at 70% 60%, rgba(138, 43, 226, 0.2) 0%, transparent 20%)
        `}
        className="rotating-background"
        zIndex={0}
      />

      {/* 动画关键帧 */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(100, 149, 237, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(100, 149, 237, 0); }
          100% { box-shadow: 0 0 0 0 rgba(100, 149, 237, 0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .rotating-background {
          animation: rotate 20s linear infinite;
        }
      `}</style>

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
        animation="float 3s ease-in-out infinite"
        _hover={{
          animation: 'pulse 2s infinite',
        }}
      >
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </Box>
    </Flex>
  )
}
