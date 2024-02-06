import './index.css'
import 'leaflet/dist/leaflet.css'
import { createRoot } from 'react-dom/client'
import App from './routes/App'

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
