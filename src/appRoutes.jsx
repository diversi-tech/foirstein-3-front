// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ResponsiveAppBar from './components/ResponsiveAppBar';
// import HomePage from "./components/homePage";

import ItemList from "./components/item/item-list";
import ItemDdd from "./components/item/item-add";
import TagList from "./components/tag/tag-list";
import TagAdd from "./components/tag/tag-add";
import ImageHomePage from "./components/homePage"
import Header from './components/Header'
import Footer from "./components/footer";
import PendingItems from "./components/pendingItemsList/pendingItems";
// import { RiH1 } from "react-icons/ri";
import StudentRequest from "./components/studentRequest/student-request";
import { Box } from '@mui/material';
export default function AppRoutes() {
  return (
  
    <Router>
      <Header/>
      <Routes>
          <Route path="/" element={<div> <ImageHomePage/> </div>} />
          <Route path="/items" element={<Box sx={{ pt: '7%' }}><ItemList/></Box>} />
          <Route path="/itemsPendingApproval" element={<Box sx={{ pt: '7%' }}><PendingItems/></Box>} />
          <Route path="/items/add" element={<Box sx={{ pt: '7%' }}><ItemDdd /></Box>} />
          <Route path="/tag-list" element={<Box sx={{ pt: '7%' }}><TagList /></Box>} />
          <Route path="/tags/add" element={<Box sx={{ pt: '7%' }}><TagAdd /></Box>} />
          <Route path="/studentRequest" element={<Box sx={{ pt: '7%' }}><StudentRequest/></Box>} />
          <Route path="/afterHanddle" element={<h1 style={{marginTop:"50px"}}>לאחר טיפול</h1>} />
          {/* <Route path="/studentsRequest" element={<studentsRequest />}/> */}
      </Routes>
      <Footer />
    </Router>
  );
}
