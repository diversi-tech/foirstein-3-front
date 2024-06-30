import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'

import ItemList from './components/item/item-list'

function App() {
  return (<>
    <ItemList />
  </>
  )
}

export default App