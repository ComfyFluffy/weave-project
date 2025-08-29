import { useState } from 'react'
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react'
import { toaster } from '../ui/toaster'
import { useLogin, useRegister } from '../../hooks/auth'

interface AuthFormProps {
  mode: 'login' | 'register'
  onSuccess: () => void
  onSwitchMode: () => void
}

interface FormData {
  displayName?: string
  email: string
  password: string
  confirmPassword?: string // 仅用于注册时的密码确认
}

export function AuthForm({ mode, onSuccess, onSwitchMode }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const isLogin = mode === 'login'
  const isPending = isLogin
    ? loginMutation.isPending
    : registerMutation.isPending

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 如果是邮箱输入，实时验证
    if (name === 'email') {
      const validationError = validateEmail(value)
      setEmailError(validationError)
    }
    
    // 如果是密码输入，实时验证
    if (name === 'password') {
      const validationError = validatePassword(value)
      setPasswordError(validationError)
      
      // 如果确认密码已经输入，同时也验证确认密码
      if (formData.confirmPassword) {
        const confirmPasswordError = validateConfirmPassword(value, formData.confirmPassword)
        setConfirmPasswordError(confirmPasswordError)
      }
    }
    
    // 如果是确认密码输入，验证确认密码
    if (name === 'confirmPassword') {
      const confirmPasswordError = validateConfirmPassword(formData.password, value)
      setConfirmPasswordError(confirmPasswordError)
    }
  }

  // 密码验证函数
  const validatePassword = (password: string): string => {
    // 检查密码长度
    if (password.length < 6 || password.length > 20) {
      return '密码长度必须在6-20个字符之间'
    }

    // 检查密码包含的字符类型
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSymbols = /[!@#$%^&*()_+\-={};':"\\|,.<>/?]/.test(password)

    // 计算包含的字符类型数量
    const charTypesCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSymbols].filter(Boolean).length

    // 检查是否至少包含两种字符类型
    if (charTypesCount < 2) {
      return '密码必须包含大写字母、小写字母、数字和符号中的至少两种'
    }

    return '' // 验证通过
  }

  // 邮箱验证函数
  const validateEmail = (email: string): string => {
    if (!email) {
      return '' // 空的先不验证
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return '请输入有效的邮箱地址，例如：example@example.com'
    }
    
    return '' // 验证通过
  }

  // 验证确认密码
  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) {
      return '' // 空的不验证，只在提交时验证必填
    }
    
    if (password !== confirmPassword) {
      return '两次输入的密码不一致'
    }
    
    return '' // 验证通过
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证邮箱
    const emailValidationError = validateEmail(formData.email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    } else {
      setEmailError('')
    }

    // 验证密码
    const validationError = validatePassword(formData.password)
    if (validationError) {
      setPasswordError(validationError)
      return
    } else {
      setPasswordError('')
    }

    // 如果是注册，验证确认密码
    if (!isLogin) {
      // 确认密码为空
      if (!formData.confirmPassword) {
        setConfirmPasswordError('请再次输入密码以确认')
        return
      }
      
      // 验证确认密码是否匹配
      const confirmPasswordValidationError = validateConfirmPassword(formData.password, formData.confirmPassword || '')
      if (confirmPasswordValidationError) {
        setConfirmPasswordError(confirmPasswordValidationError)
        return
      } else {
        setConfirmPasswordError('')
      }
    }

    if (isLogin) {
      const loginData = {
        email: formData.email,
        password: formData.password,
      }

      loginMutation.mutate(
        { body: loginData },
        {
          onSuccess: () => {
            toaster.create({
              title: '登录成功',
              description: '欢迎回来！',
              type: 'success',
            })
            onSuccess()
          },
          onError: () => {
            toaster.create({
              title: '登录失败',
              type: 'error',
            })
          },
        }
      )
    } else {
      const registerData = {
        displayName: formData.displayName || '',
        email: formData.email,
        password: formData.password,
      }

      registerMutation.mutate(
        {
          body: registerData,
        },
        {
          onSuccess: () => {
            toaster.create({
              title: '注册成功',
              description: '账户创建成功，正在为您登录...',
              type: 'success',
            })
            onSuccess()
          },
          onError: (error) => {
            let errorMessage = '注册失败'
            
            // 根据错误类型显示更友好的错误消息
            try {
              // 尝试从错误对象中获取消息
              const errorMsg = (error as any)?.body?.message ||
                             (error as any)?.message ||
                             (error as any)?.toString() ||
                             '未知错误'
              
              if (errorMsg.includes('User already exists') ||
                  errorMsg.includes('already exists') ||
                  errorMsg.includes('已被注册')) {
                errorMessage = '该邮箱已被注册，请使用其他邮箱或尝试登录'
              } else if (errorMsg.includes('password')) {
                errorMessage = '密码不符合要求，请检查'
              } else {
                errorMessage = errorMsg
              }
            } catch (e) {
              // 如果解析错误失败，使用默认消息
              console.error('Error parsing error message:', e)
            }
            
            toaster.create({
              title: '注册失败',
              description: errorMessage,
              type: 'error',
            })
          },
        }
      )
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
            {emailError && (
              <Text mt={1} color="red.400" fontSize="sm">
                {emailError}
              </Text>
            )}
            {!emailError && (
              <Text mt={1} color="gray.400" fontSize="sm">
                请输入有效的邮箱地址，例如：example@example.com
              </Text>
            )}
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
            {passwordError && (
              <Text mt={1} color="red.400" fontSize="sm">
                {passwordError}
              </Text>
            )}
            {!isLogin && !passwordError && (
              <Text mt={1} color="gray.400" fontSize="sm">
                密码长度6-20个字符，需包含大写字母、小写字母、数字和符号中的至少两种
              </Text>
            )}
          </Box>

          {!isLogin && (
            <Box width="100%">
              <Text mb={2} color="gray.300" fontWeight="medium">
                确认密码
              </Text>
              <Box position="relative">
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleChange}
                  placeholder="请再次输入密码"
                  {...inputStyle}
                />
              </Box>
              {confirmPasswordError && (
                <Text mt={1} color="red.400" fontSize="sm">
                  {confirmPasswordError}
                </Text>
              )}
            </Box>
          )}

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
