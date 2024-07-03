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
import PendingItems from "./components/pendingItemsList/pendingItems";
import { RiH1 } from "react-icons/ri";
import StudentRequest from "./components/studentRequest/student-request";

export default function AppRoutes() {
  return (
  
    <Router>
      <Header/>
      <Routes>
          <Route path="/" element={<div> <ImageHomePage/> </div>} />
          <Route path="/items" element={<ItemList/>} />
          <Route path="/itemsPendingApproval" element={<PendingItems/>} />
          <Route path="/items/add" element={<ItemDdd />} />
          <Route path="/tag-list" element={<TagList />} />
          <Route path="/tags/add" element={<TagAdd />} />
          <Route path="/studentRequest" element={<StudentRequest/>} />
          <Route path="/afterHanddle" element={<h1 style={{marginTop:"50px"}}>לאחר טיפול</h1>} />
          {/* <Route path="/studentsRequest" element={<studentsRequest />}/> */}

      </Routes>
      <Footer />
    </Router>
  );
}
