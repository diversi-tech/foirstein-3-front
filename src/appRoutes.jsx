import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homePage";
import ItemList from "./components/item/item-list";
import ItemDdd from "./components/item/item-add";
import TagList from "./components/tag/tag-list";
import TagAdd from "./components/tag/tag-add";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/add" element={<ItemDdd />} />
          <Route path="/tags" element={<TagList />} />
          <Route path="/tags/add" element={<TagAdd />} />
          {/* <Route path="/studentsRequest" element={<studentsRequest />}/> */}
        </Route>
      </Routes>
    </Router>
  );
}
