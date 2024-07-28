import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
// import AppRoutes from './appRoutes'
import PendingItems from './components/pendingItemsList/pendingItems'
import SideNav from "./components/side_nav"
import { Routing } from './components/Routing'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // האזנה להודעות postMessage
    const handleMessage = (event) => {
      console.log('Received message:', event)
      const allowedOrigins = [
        'https://login.foirstein.diversitech.co.il',  // דומיין הפרויקט הראשי
        'https://diversi-tech.github.io'     // דומיין נוסף המותר
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
  
  return (<>
    {/* <AppRoutes /> */}
    {/* <SideNav></SideNav> */}
    {/* <PendingItems /> */}
    <Routing></Routing>
  </>
  )
}

export default App

 