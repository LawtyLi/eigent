import { Routes, Route, Navigate } from 'react-router-dom'
import Config from './pages/Config'
import Chat from './pages/Chat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/config" replace />} />
      <Route path="/config" element={<Config />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

export default App
