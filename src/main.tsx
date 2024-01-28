import './index.css'
import 'leaflet/dist/leaflet.css'
import Home from './routes/Home'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:code" element={<Home />} />
      <Route path="/:code/ballot-paper" element={<Home />} />
      <Route
        path="*"
        element={
          <div className="flex flex-col text-gray-400 items-center">
            <div className="text-7xl mb-2">404</div>
            <div className="text-2xl mb-10">Page not found</div>
            <Link
              to="/"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Back to Home
            </Link>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>
)
