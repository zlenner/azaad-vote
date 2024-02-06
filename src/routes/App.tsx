import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  redirect
} from 'react-router-dom'
import { DataProvider } from '../hooks/useData'
import { useLoadData } from '../hooks/useData/useLoadData'
import Home from './Home'
import Page404 from './404'
import Poster from './Poster'
function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App>
              <Home />
            </App>
          }
        />
        <Route
          path="/:code"
          element={
            <App>
              <Home />
            </App>
          }
        />
        <Route
          path="/:code/ballot-paper"
          element={
            <App>
              <Home />
            </App>
          }
        />
        <Route
          path="/poster"
          element={<Navigate to="kpk" relative="route" />}
        />
        <Route
          path="/poster/:province"
          element={<Navigate to="6" relative="route" />}
        />
        <Route
          path="/poster/:province/:rows"
          element={
            <App>
              <Poster />
            </App>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  )
}

function App({ children }: { children: JSX.Element }) {
  const data = useLoadData()

  if (!data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        Loading...
      </div>
    )
  } else {
    return <DataProvider initialValue={data}>{children}</DataProvider>
  }
}

export default Routing
