/* 
'
import App from './App.jsx'


import { createBrowserRouter} from 'react-dom'
import { RouterProvider} from 'react-dom'


import User from './components/user/User.jsx'
 */
//import User from './components/user/User.jsx'
//import Admin from './components/admin/Admin.jsx'
//import ServicesArray from './components/servicesArray/ServicesArray.jsx'
//import Meeting from './components/meeting/Meeting.jsx'

//const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element:<User/>,
  //   errorElements: <div>error contants</div>
  // },
  // {
  //   path: '/admin',
  //   element:<Admin/>,
  //   errorElements: <div>error contants</div>,
  //   children :[
  //   { path: '/',
  //     errorElements: <div>error contants</div>,
  //   }
    /* {
      path: '/services',
      element:<ServicesArray/>,
      errorElements: <div>error contants</div>,
    } */
    /* {
      path: '/meeting',
      element:<Meeting/>,
      errorElements: <div>error contants</div>,
    } */
    //]
 // }
//])

import './index.css'
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <RouterProvider router={router} />  */}
  </React.StrictMode>,
)
