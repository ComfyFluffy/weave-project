export interface UserRegistrationRequest {
  displayName: string
  email: string
  password: string
}

export interface UserLoginRequest {
  email: string
  password: string
}
