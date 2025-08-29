import { authContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { generateToken } from '../utils/jwt'
import bcrypt from 'bcrypt'
import { prisma } from '../services/database'
const saltRound = 10

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

export function createAuthRouter() {
  const s = initServer()
  return s.router(authContract, {
    login: async ({ body }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      })
      if (!user) {
        return {
          status: 404,
          body: {
            message: `用户不存在，请先注册或检查邮箱是否正确`,
          },
        }
      }

      if (!(await bcrypt.compare(body.password, user.password))) {
        return {
          status: 400,
          body: {
            message: `登录失败，邮箱或密码不正确`,
          },
        }
      }
      console.log('Generating token...')
      const token = generateToken({ userId: user.id })

      return {
        status: 200,
        body: {
          token,
        },
      }
    },
    register: async ({ body }) => {
      try {
        // 验证密码
        const passwordValidationError = validatePassword(body.password)
        if (passwordValidationError) {
          return {
            status: 400,
            body: {
              message: passwordValidationError,
            },
          }
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: body.email },
        })
        if (existingUser) {
          return {
            status: 409,
            body: {
              message: '该邮箱已被注册，请使用其他邮箱或尝试登录',
            },
          }
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            displayName: body.displayName,
            email: body.email,
            password: await bcrypt.hash(body.password, saltRound),
            avatar: null,
          },
        })

        // Generate a token for the newly registered user
        const token = generateToken({ userId: newUser.id })

        return {
          status: 200,
          body: {
            token,
          },
        }
      } catch (error) {
        console.error('Error creating user:', error)
        return {
          status: 400,
          body: {
            message: '创建用户失败，请稍后重试',
          },
        }
      }
    },
  })
}
