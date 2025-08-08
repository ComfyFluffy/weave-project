import { useState } from 'react'
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react'
import { toaster } from '../ui/toaster'
import { useAuth } from '../../providers/AuthProvider'
import { useLogin, useRegister } from '../../hooks/useAuth'
import type {
  UserLoginRequest,
  UserRegistrationRequest,
} from '@weave/types/apis'

interface AuthFormProps {
  mode: 'login' | 'register'
  onSuccess: () => void
  onSwitchMode: () => void
}

interface FormData {
  displayName?: string
  email: string
  password: string
}

export function AuthForm({ mode, onSuccess, onSwitchMode }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    password: '',
  })

  const { login } = useAuth()
  const { mutate: loginMutation, isPending: isLoginPending } = useLogin()
  const { mutate: registerMutation, isPending: isRegisterPending } =
    useRegister()

  const isLogin = mode === 'login'
  const isPending = isLogin ? isLoginPending : isRegisterPending

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      const loginData: UserLoginRequest = {
        email: formData.email,
        password: formData.password,
      }

      loginMutation(loginData, {
        onSuccess: (user) => {
          login(user)
          toaster.success({
            title: '登录成功',
            description: '欢迎回来！',
          })
          onSuccess()
        },
        onError: (error) => {
          toaster.error({
            title: '登录失败',
            description: error instanceof Error ? error.message : '未知错误',
          })
        },
      })
    } else {
      const registerData: UserRegistrationRequest = {
        displayName: formData.displayName || '',
        email: formData.email,
        password: formData.password,
      }

      registerMutation(registerData, {
        onSuccess: () => {
          toaster.success({
            title: '注册成功',
            description: '您的账户已创建，请登录',
          })
          onSuccess()
        },
        onError: (error) => {
          toaster.error({
            title: '注册失败',
            description: error instanceof Error ? error.message : '未知错误',
          })
        },
      })
    }
  }

  const inputStyle = {
    bg: 'rgba(30, 30, 46, 0.8)',
    border: '1px solid',
    borderColor: 'rgba(100, 149, 237, 0.3)',
    color: 'white',
    _placeholder: { color: 'gray.400' },
    _focus: {
      borderColor: 'blue.400',
      boxShadow: '0 0 10px rgba(100, 149, 237, 0.5)',
    },
    py: 6,
    px: 4,
    borderRadius: 'md',
    _hover: {
      borderColor: 'blue.300',
    },
  }

  return (
    <VStack gap={6} align="stretch">
      <Heading
        as="h2"
        size="lg"
        textAlign="center"
        color="white"
        textShadow="0 0 10px rgba(100, 149, 237, 0.7)"
        letterSpacing="1px"
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50px',
          height: '3px',
          bg: 'blue.400',
          boxShadow: '0 0 5px rgba(100, 149, 237, 0.7)',
          borderRadius: '2px',
        }}
      >
        {isLogin ? '用户登录' : '用户注册'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          {!isLogin && (
            <Box width="100%">
              <Text mb={2} color="gray.300" fontWeight="medium">
                用户名
              </Text>
              <Box position="relative">
                <Input
                  type="text"
                  name="displayName"
                  value={formData.displayName || ''}
                  onChange={handleChange}
                  placeholder="请输入用户名"
                  {...inputStyle}
                />
              </Box>
            </Box>
          )}

          <Box width="100%">
            <Text mb={2} color="gray.300" fontWeight="medium">
              邮箱
            </Text>
            <Box position="relative">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入邮箱"
                {...inputStyle}
              />
            </Box>
          </Box>

          <Box width="100%">
            <Text mb={2} color="gray.300" fontWeight="medium">
              密码
            </Text>
            <Box position="relative">
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="请输入密码"
                {...inputStyle}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            colorPalette="blue"
            width="100%"
            loading={isPending}
            py={6}
            mt={4}
            fontWeight="medium"
            bg="linear-gradient(135deg, #6366f1, #818cf8)"
            color="white"
            borderRadius="md"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            _hover={{
              bg: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              boxShadow: '0 0 15px rgba(100, 149, 237, 0.7)',
            }}
            _active={{
              transform: 'translateY(1px)',
            }}
            transition="all 0.2s ease-in-out"
          >
            {isLogin ? '登录' : '注册'}
          </Button>
        </VStack>
      </form>

      <Box height="1px" bg="gray.700" my={6} />

      <Text textAlign="center" color="gray.400">
        {isLogin ? '还没有账户？' : '已有账户？'}{' '}
        <Button
          variant="ghost"
          colorPalette="blue"
          onClick={onSwitchMode}
          fontWeight="medium"
          _hover={{
            color: 'blue.300',
            textDecoration: 'underline',
          }}
        >
          {isLogin ? '立即注册' : '立即登录'}
        </Button>
      </Text>
    </VStack>
  )
}
