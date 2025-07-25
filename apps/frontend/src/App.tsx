import { ChatLayout } from './components/ChatLayout'
import { QueryProvider } from './providers/QueryProvider'
import './App.css'

function App() {
  return (
    <QueryProvider>
      <ChatLayout />
    </QueryProvider>
  )
}

export default App
