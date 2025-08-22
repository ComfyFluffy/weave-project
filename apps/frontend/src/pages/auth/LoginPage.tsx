import { useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { AuthForm } from '../../components/auth/AuthForm'

export function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    const from = '/app'
    void navigate(from, { replace: true })
  }

  const handleSwitchToRegister = () => {
    void navigate('/auth/register')
  }

  return (
    <AuthLayout>
      <AuthForm
        mode="login"
        onSuccess={handleLoginSuccess}
        onSwitchMode={handleSwitchToRegister}
      />
    </AuthLayout>
  )
}
