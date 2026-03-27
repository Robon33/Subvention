import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Simulateur from './components/Simulateur'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simulateur" element={<SimulateurPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function SimulateurPage() {
  return (
    <div className="sim-bg min-h-screen">
      <Simulateur />
    </div>
  )
}
