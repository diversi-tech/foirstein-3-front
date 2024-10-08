import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
// import AppRoutes from './appRoutes'
import PendingItems from './components/pendingItemsList/pendingItems'
import SideNav from "./components/side_nav"
import { Routing } from './components/Routing'
import { useEffect } from 'react'
import AddNewRequest from './components/AddNewRequest/AddNewRequest'
import CssBaseline from '@mui/material/CssBaseline';
import {validateToken} from './components/decipheringToken';
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
function App() {
  useEffect(() => {
    // האזנה להודעות postMessage
    const handleMessage = (event) => {
  
      const allowedOrigins = [
        'https://login.foirstein.diversitech.co.il',  // דומיין הפרויקט הראשי
        'https://diversi-tech.github.io',
        // 'https://librarian.foirstein.diversitech.co.il'     // דומיין נוסף המותר
      ];
      if (allowedOrigins.includes(event.origin)) {
        const token = event.data.token;
        if (token) {
          sessionStorage.setItem('token', token);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    // נקה את האזנת האירועים כאשר הקומפוננטה מוסרת מה-DOM
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
//to route the user when he is not connected
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const isValid = await validateToken();
  //     if (!isValid) {
  //       console.log("go to other domain!!!!!!")
  //       window.location.replace ('https://login.foirstein.diversitech.co.il') ;
  //       console.log("go to other domain!!!!!!")

  //     }
  //     else
  //     console.log("valid tokennnn");
  //   };

  //   checkToken();
  // }, []);
  
  // useEffect(() => {
  //   // פונקציה למחיקת הטוקן מהקוקי
  //   function deleteTokenCookie() {
  //     document.cookie = `jwt=; path=/; domain=.foirstein.diversitech.co.il; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

  //   }

  //   // מחיקת הקוקי בעת סגירת הכרטיסייה
  //   window.addEventListener('beforeunload', deleteTokenCookie);

  //   // ניקוי המאזין בעת הסרת הקומפוננטה מה-DOM
  //   return () => {
  //     window.removeEventListener('beforeunload', deleteTokenCookie);
  //   };
  // }, []);
  const theme = createTheme({
    typography: {
      fontFamily: 'Rubik',
    },
  })
  
  return (<>
  ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    {/* <App /> */}
    {/* <RouterProvider router={router} />  */}
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Routing></Routing>
  </ThemeProvider>,
  </React.StrictMode>,
)
    {/* <AppRoutes /> */}
    {/* <SideNav></SideNav> */}
    {/* <PendingItems /> */}
    {/* <Routing></Routing> */}
    {/* <AddNewRequest></AddNewRequest> */}
  
  </>
  )
}

export default App

 