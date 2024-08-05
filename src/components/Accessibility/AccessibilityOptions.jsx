import React, { useState, useEffect } from 'react';
import { Button, Drawer, Switch, FormControlLabel, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import CloseIcon from '@mui/icons-material/Close';
import ScreenReaderIcon from '@mui/icons-material/Hearing';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GrayscaleIcon from '@mui/icons-material/InvertColors';
import StopIcon from '@mui/icons-material/Block';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import UnderlineIcon from '@mui/icons-material/FormatUnderlined';

const useStyles = makeStyles({
  drawer: {
    width: '270px', // רוחב קבוע
    height: 'auto', // גובה מותאם לתוכן
    top: '10%', // 10% מלמעלה
    bottom: '10%', // 10% מלמטה
    borderRadius: '16px', // פינות מעוגלות
    padding: '16px',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    borderRadius: '50%',
    minWidth: '60px',
    minHeight: '60px',
    width: '60px',
    height: '60px',
    padding: 0,
    backgroundColor: '#ffeb3b', // צבע רקע לנגישות
    color: '#1976d2', // צבע טקסט לנגישות
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#fdd835',
    },
  },
  icon: {
    fontSize: '2rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderRadius: '8px',
  },
  listItemText: {
    flex: '1',
  },
  iconButton: {
    marginRight: 8,
  },
});

const AccessibilityOptions = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    useScreenReader: JSON.parse(sessionStorage.getItem('useScreenReader')) || false,
    keyboardNavigation: JSON.parse(sessionStorage.getItem('keyboardNavigation')) || false,
    changeColors: JSON.parse(sessionStorage.getItem('changeColors')) || false,
    highContrast: JSON.parse(sessionStorage.getItem('highContrast')) || false,
    stopAnimations: JSON.parse(sessionStorage.getItem('stopAnimations')) || false,
    increaseTextSize: JSON.parse(sessionStorage.getItem('increaseTextSize')) || false,
    addUnderlines: JSON.parse(sessionStorage.getItem('addUnderlines')) || false,
    grayscale: JSON.parse(sessionStorage.getItem('grayscale')) || false,
  });

  useEffect(() => {
    const css = `
      .high-contrast {
        background-color: black !important;
        color: yellow !important;
      }
      .high-contrast a {
        color: cyan !important;
      }
      .high-contrast input, .high-contrast textarea, .high-contrast select, .high-contrast button,
      .high-contrast .MuiInputBase-root, .high-contrast .MuiButton-root,
      .high-contrast .MuiOutlinedInput-root, .high-contrast .MuiInputLabel-root,
      .high-contrast .MuiFormLabel-root, .high-contrast .MuiFormControl-root,
      .high-contrast .MuiPaper-root, .high-contrast .MuiDrawer-paper,
      .high-contrast .MuiTypography-root, .high-contrast .MuiSwitch-root,
      .high-contrast .MuiButton-label, .high-contrast .MuiFormControlLabel-label,
      .high-contrast table, .high-contrast th, .high-contrast td {
        background-color: black !important;
        color: yellow !important;
        border: 1px solid yellow !important;
      }
      .high-contrast input:focus, .high-contrast textarea:focus, .high-contrast select:focus,
      .high-contrast .MuiOutlinedInput-root.Mui-focused {
        border-color: cyan !important;
        outline: none !important;
        box-shadow: 0 0 10px cyan !important;
      }
      .high-contrast .MuiInputBase-input {
        color: yellow !important;
        background-color: black !important;
      }
      .high-contrast .MuiInput-underline:before {
        border-bottom: 2px solid yellow !important;
      }
      .high-contrast .MuiInput-underline:hover:not(.Mui-disabled):before {
        border-bottom: 2px solid cyan !important;
      }
      .high-contrast .MuiOutlinedInput-notchedOutline {
        border-color: yellow !important;
      }
      .high-contrast .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: cyan !important;
      }
      .increase-text-size * {
        font-size: 1.05em !important;
      }
      .add-underlines a {
        text-decoration: underline !important;
      }
      .grayscale {
        filter: grayscale(100%) !important;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // Apply settings from sessionStorage on component mount
    Object.keys(settings).forEach((option) => {
      if (settings[option]) {
        handleToggle(option, true);
      }
    });
  }, []);

  useEffect(() => {
    const allFocusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    allFocusableElements.forEach(el => {
      if (settings.keyboardNavigation) {
        el.setAttribute('tabindex', '0');
      } else {
        el.setAttribute('tabindex', '-1');
      }
    });
  }, [settings.keyboardNavigation]);

  const handleToggle = (option, initialLoad = false) => {
    const newSettings = { ...settings, [option]: initialLoad ? settings[option] : !settings[option] };
    setSettings(newSettings);
    sessionStorage.setItem(option, JSON.stringify(newSettings[option]));

    if (option === 'highContrast') {
      document.body.classList.toggle('high-contrast', newSettings.highContrast);
    }

    if (option === 'increaseTextSize') {
      document.body.classList.toggle('increase-text-size', newSettings.increaseTextSize);
    }

    if (option === 'addUnderlines') {
      document.body.classList.toggle('add-underlines', newSettings.addUnderlines);
    }

    if (option === 'grayscale') {
      document.body.classList.toggle('grayscale', newSettings.grayscale);
    }
  };

  return (
    <div>
      <IconButton className={classes.button} onClick={() => setIsOpen(true)}>
        <AccessibilityIcon className={classes.icon} />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)} classes={{ paper: classes.drawer }}>
        <div className={classes.drawerHeader}>
          <Typography variant="h6">אפשרויות נגישות</Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem className={`${classes.listItem} ${settings.useScreenReader ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <ScreenReaderIcon />
            </IconButton>
            <ListItemText primary="שימוש בקורא מסך" className={classes.listItemText} />
            <Switch
              checked={settings.useScreenReader}
              onChange={() => handleToggle('useScreenReader')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.keyboardNavigation ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <KeyboardIcon />
            </IconButton>
            <ListItemText primary="ניווט באמצעות מקלדת" className={classes.listItemText} />
            <Switch
              checked={settings.keyboardNavigation}
              onChange={() => handleToggle('keyboardNavigation')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.changeColors ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <ColorLensIcon />
            </IconButton>
            <ListItemText primary="שינוי צבעים" className={classes.listItemText} />
            <Switch
              checked={settings.changeColors}
              onChange={() => handleToggle('changeColors')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.highContrast ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <ColorLensIcon />
            </IconButton>
            <ListItemText primary="ניגודיות גבוהה" className={classes.listItemText} />
            <Switch
              checked={settings.highContrast}
              onChange={() => handleToggle('highContrast')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.stopAnimations ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <StopIcon />
            </IconButton>
            <ListItemText primary="עצירת אנימציות" className={classes.listItemText} />
            <Switch
              checked={settings.stopAnimations}
              onChange={() => handleToggle('stopAnimations')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.increaseTextSize ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <TextIncreaseIcon />
            </IconButton>
            <ListItemText primary="הגדלת טקסט" className={classes.listItemText} />
            <Switch
              checked={settings.increaseTextSize}
              onChange={() => handleToggle('increaseTextSize')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.addUnderlines ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <UnderlineIcon />
            </IconButton>
            <ListItemText primary="הוספת קווים תחתונים" className={classes.listItemText} />
            <Switch
              checked={settings.addUnderlines}
              onChange={() => handleToggle('addUnderlines')}
            />
          </ListItem>
          <ListItem className={`${classes.listItem} ${settings.grayscale ? 'color-contrast' : ''}`}>
            <IconButton className={classes.iconButton}>
              <GrayscaleIcon />
            </IconButton>
            <ListItemText primary="גווני אפור" className={classes.listItemText} />
            <Switch
              checked={settings.grayscale}
              onChange={() => handleToggle('grayscale')}
            />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default AccessibilityOptions;
