import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'

import AppRoutes from './appRoutes'
import PendingItems from './components/pendingItemsList/pendingItems'
function App() {
  return (<>
    {/* <AppRoutes /> */}
    <PendingItems />
  </>
  )
}

export default App