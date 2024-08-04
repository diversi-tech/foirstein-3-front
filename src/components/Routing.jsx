// import { BrowserRouter, Route, Routes, HashRouter } from "react-router-dom";
import { Nav } from "./Nav";

import Footer from "./footer";

import { useEffect } from "react";
import DataTable from "./item/BorrowingItemsList";

import React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import TagIcon from '@mui/icons-material/Label';
import RequestIcon from '@mui/icons-material/Assignment';
import { BrowserRouter as Router, Routes, Route, Link, HashRouter } from 'react-router-dom';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { styled } from '@mui/material/styles';

import ItemList from './item/item-list';
import PendingItems from './pendingItemsList/pendingItems';
import ItemAdd from './item/item-add';
import TagList from './tag/tag-list';
import TagAdd from './tag/tag-add';
import StudentRequest from './studentRequest/student-request';
import Borrowing from "./borrowing&return/borrowing";
import Returning from "./borrowing&return/returning"
import { Tooltip } from '@mui/material';
import AccessibilityOptions from "./AccessibilityOptions";
import { AccessibilityProvider } from "./AccessibilityContext";

import '../App.css'

const baseDomain='.foirstein.diversitech.co.il/#/'
const loginDomain=`https://login${baseDomain}`

function ExternalRedirect({ url }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return null;
}
export const Routing = () => {
  return (
    <HashRouter>
      <AccessibilityProvider>
        <nav className="navbar">
          <Nav />
        </nav>
        <div className="content">
          <div className="Accessibility">
            <AccessibilityOptions />
          </div>
          <Routes>
          <Route path='/homePage' element={<ExternalRedirect url={loginDomain} />} />

          {/* <Route path='/home' element={<div><ItemList /></div>} /> */}
        <Route path="/" element={<div><ItemList /></div>} />
        <Route path="/Librarian" element={<div><ItemList /></div>} />
        <Route path="/items" element={<Box ><ItemList /></Box>} />
        <Route path="/itemsPendingApproval" element={<Box ><PendingItems /></Box>} />
        <Route path="/items/add" element={<Box ><ItemAdd /></Box>} />
        <Route path="/tag-list" element={<Box><TagList /></Box>} />
        <Route path="/tags/add" element={<Box><TagAdd /></Box>} />
        <Route path="/items/borrowingItems" element={<Box><DataTable /></Box>} /> 
        <Route path="/borrowing" element={<Box><Borrowing /></Box>} /> 
        <Route path="/returning" element={<Box><Returning /></Box>} /> 
        <Route path="/studentRequest" element={<Box><StudentRequest /></Box>} />
        <Route path='/search' element={<ExternalRedirect url={`${loginDomain}search`} />} />
        <Route path='/ActivityLog' element={<ExternalRedirect url={`${loginDomain}ActivityLog`} />} />
        <Route path='/Charts' element={<ExternalRedirect url={`${loginDomain}Charts`} />} />
        <Route path='/changePermission' element={<ExternalRedirect url={`${loginDomain}changePermission`} />} />
        <Route path='/UserManagementComponent' element={<ExternalRedirect url={`${loginDomain}UserManagementComponent`} />} />
        <Route path='/login' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='/profile' element={<ExternalRedirect url={`${loginDomain}profile"`} />} />
        <Route path='/profileform' element={<ExternalRedirect url={`${loginDomain}profileform`} />} />
        <Route path='/ManagerDashboard' element={<ExternalRedirect url={`${loginDomain}ManagerDashboard`} />} />
        <Route path='/view-reports' element={<ExternalRedirect url={`${loginDomain}view-reports`} />} />
        <Route path='/report/:reportId' element={<ExternalRedirect url={`${loginDomain}report/`} />} />
        <Route path='login/register' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='login/security-question' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='/reset-password' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='/password-reset-success' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='login/security-question/reset-password/password-reset-success/logi' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='login/security-question/reset-password/password-reset-success/login/home' element={<ExternalRedirect url={`${loginDomain}login`} />} />
        <Route path='/passwordRecovery' element={<ExternalRedirect url={`${loginDomain}login`} />} />

        <Route path="*" element={<h1>Page Not Found</h1>} />

        
          </Routes>
          <Footer />
        </div>
      </AccessibilityProvider >
    </HashRouter>
  );
}