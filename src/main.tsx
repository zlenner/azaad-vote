import './index.css'
import 'leaflet/dist/leaflet.css'
import Home from './routes/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:seat" element={<Home />} />
    </Routes>
  </BrowserRouter>
)
