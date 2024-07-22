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

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#f0f0f0', // רקע אפור בהיר בהיר
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    boxShadow: '0px 0px 8px 4px rgba(0, 0, 0, 0.2)',
  },
  position: 'fixed',
  right: theme.spacing(2),
  top: theme.spacing(2),
  zIndex: 1300,
}));

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleToggleDrawer = () => {
    setState((prevState) => ({ ...prevState, right: !prevState.right }));
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: 250,
        direction: 'rtl',
        textAlign: 'right',
        padding: 2,
        borderRadius: '15px',
        height: 'auto',
        maxHeight: '80vh',
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List dir="rtl">
        {[
          { text: 'כל הפריטים', icon: <MailIcon />, path: '/items', bgColor: '#FFD1DC' },
          { text: ' ממתינים לאישור', icon: <InboxIcon />, path: '/itemsPendingApproval', bgColor: '#C1E1C1' },
          { text: 'ניהול תגיות', icon: <TagIcon />, path: '/tag-list', bgColor: '#FFB347' },
          { text: 'בקשות תלמידות', icon: <RequestIcon />, path: '/studentRequest', bgColor: '#AEC6CF' }
        ].map((item, index) => (
          <ListItem key={index} disablePadding sx={{ marginBottom: 2 }}>
            <ListItemButton component={Link} to={item.path} sx={{ backgroundColor: item.bgColor, borderRadius: '10px' }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ textAlign: 'right' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <HashRouter>
      <div>
        <React.Fragment key={'right'}>
          <Tooltip title="תפריט" arrow>
            <CustomIconButton onClick={handleToggleDrawer}>
              <ArrowDropDownCircleIcon
                style={{
                  color: 'black',
                  transform: state.right ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </CustomIconButton>
          </Tooltip>
          <SwipeableDrawer
            anchor={'right'}
            open={state['right']}
            onClose={toggleDrawer('right', false)}
            onOpen={toggleDrawer('right', true)}
            sx={{
              '.MuiDrawer-paper': {
                borderRadius: '15px',
                width: 250,
                position: 'fixed',
                top: '20%',
                right: 0,
                transform: 'translateY(-50%)',
                height: 'auto',
                maxHeight: '80vh',
              },
            }}
          >
            {list('right')}
          </SwipeableDrawer>

        </React.Fragment>
      </div>
      <Routes>
        <Route path="/" element={<div><ItemList /></div>} />
        <Route path="/items" element={<Box sx={{ pt: '7%' }}><ItemList /></Box>} />
        <Route path="/itemsPendingApproval" element={<Box sx={{ pt: '7%' }}><PendingItems /></Box>} />
        <Route path="/items/add" element={<Box sx={{ pt: '7%' }}><ItemAdd /></Box>} />
        <Route path="/tag-list" element={<Box sx={{ pt: '7%' }}><TagList /></Box>} />
        <Route path="/tags/add" element={<Box sx={{ pt: '7%' }}><TagAdd /></Box>} />
        <Route path="/studentRequest" element={<Box sx={{ pt: '7%' }}><StudentRequest /></Box>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </HashRouter>
  );
}
