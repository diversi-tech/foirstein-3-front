import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'

import ItemList from './components/item/item-list'
import PendingItems from './components/pendingItemsList/pendingItems'
import StudentRequest from './components/studentRequest/student-request'
function App() {
  return (<>
    {/* <ItemList /> */}
    <PendingItems />
    {/* <StudentRequest /> */}
  </>
  )
}

export default App