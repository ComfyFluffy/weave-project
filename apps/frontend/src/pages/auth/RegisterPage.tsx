import { useNavigate } from 'react-router'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { AuthForm } from '../../components/auth/AuthForm'

export function RegisterPage() {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    void navigate('/auth/login')
  }

  const handleSwitchToLogin = () => {
    void navigate('/auth/login')
  }

  return (
    <AuthLayout>
      <AuthForm
        mode="register"
        onSuccess={handleRegisterSuccess}
        onSwitchMode={handleSwitchToLogin}
      />
    </AuthLayout>
  )
}
