import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  UserLoginRequestSchema,
  UserRegistrationRequestSchema,
} from '@weave/types/apis'
import {
  ErrorResponseSchema,
  SuccessResponseSchema,
  UserLoginResponseSchema,
} from './response'
import { UserSchema } from '..'
const c = initContract()

export const authContract = c.router({
  login: {
    method: 'POST',
    path: '/auth/login',
    body: UserLoginRequestSchema,
    responses: {
      200: UserLoginResponseSchema,
      400: ErrorResponseSchema,
    },
  },
  register: {
    method: 'POST',
    path: '/auth/register',
    body: UserRegistrationRequestSchema,
    responses: {
      200: UserSchema,
      400: ErrorResponseSchema,
    },
  },
})
