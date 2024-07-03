import React from "react";
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
import { RiH1 } from "react-icons/ri";

export default function AppRoutes() {
  return (
  
    <Router>
      <Header/>
      <Routes>
          <Route path="/" element={<div style={{marginTop:'100px'}}> <ImageHomePage/> </div>} />
          <Route path="/items" element={<ItemList/>} />
          <Route path="/itemsPendingApproval" element={<ItemList/>} />
          <Route path="/items/add" element={<ItemDdd />} />
          <Route path="/tags" element={<TagList />} />
          <Route path="/tags/add" element={<TagAdd />} />
          <Route path="/waitApproval" element={<h1>טבלת המחכים לאישור</h1>} />
          <Route path="/afterHanddle" element={<h1 style={{marginTop:"50px"}}>לאחר טיפול</h1>} />
          {/* <Route path="/studentsRequest" element={<studentsRequest />}/> */}

      </Routes>
      <Footer />
    </Router>
  );
}
