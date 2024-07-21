import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
import AppRoutes from './appRoutes'
import PendingItems from './components/pendingItemsList/pendingItems'
import SideNav from "./components/side_nav"
function App() {
  return (<>
    {/* <AppRoutes /> */}
    <SideNav></SideNav>
    {/* <PendingItems /> */}
  </>
  )
}

export default App