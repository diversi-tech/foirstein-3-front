// import { BrowserRouter, Route, Routes, HashRouter } from "react-router-dom";
import { Nav } from "./Nav";
// import ChangePermission from "./changePermission";
// import UserManagementComponent from "./adminEditing";
// import ActivityLog from './ActivityLog';
// import Login from "./login/login";
// import PasswordResetSuccess from "./resetPassword/passwordResetSuccess";
// import ResetPassword from "./resetPassword/reserPassword";
// import SecurityQuestions from "./resetPassword/securityQuestions";
// import Register from "./login/register";
// import Profile from "./personalArea/profile";
// import ManagerDashboard from "./reports/creatReport";
// import ViewReports from "./reports/showReport";
// import ReportPage from "./reports/showReport1";
// import Charts from "./AllCharts/charts";
import Footer from "./footer";
// import { Home } from "./login/home";
// import PasswordRecovery from "./resetPassword/passwordRecovery";
// import '../App.css';
// import ProfileForm from "./personalArea/profileForm";
// import AccessibilityOptions from "./Accessibility/AccessibilityOptions";
// import { AccessibilityProvider } from "./Accessibility/AccessibilityContext";
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
import { Tooltip } from '@mui/material';

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
      {/* <AccessibilityProvider> */}
        <nav className="navbar">
          <Nav />
        </nav>
        <div className="content">
          <div className="Accessibility">
            {/* <AccessibilityOptions /> */}
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

            {/* <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/search' element={<iframe src="https://foirstein-2-front-1.onrender.com/" title="ProjectB" width="100%" height="600px" />} />
            <Route path='/Librarian' element={<ExternalRedirect url="https://diversi-tech.github.io/foirstein-3-front/#/" />} />
            <Route path='/Charts' element={<Charts />} />
            <Route path='login/home' element={<Home />} />
            <Route path='/ActivityLog' element={<ActivityLog />} />
            <Route path='/changePermission' element={<ChangePermission />} />
            <Route path='/UserManagementComponent' element={<UserManagementComponent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profileform" element={<ProfileForm />} />
            <Route path="home" element={<Home />} />
            <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
            <Route path="/view-reports" element={<ViewReports />} />
            <Route path="/report/:reportId" element={<ReportPage />} />
            <Route path="login/register" element={<Register />} />
            <Route path="login/security-question" element={<SecurityQuestions />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            <Route path="login/security-question/reset-password/password-reset-success/login" element={<Login />} />
            <Route path="login/security-question/reset-password/password-reset-success/login/home" element={<Home />} />
            <Route path="/passwordRecovery" element={<PasswordRecovery />} /> */}
          </Routes>
          <Footer />
        </div>
      {/* </AccessibilityProvider> */}
    </HashRouter>
  );
}