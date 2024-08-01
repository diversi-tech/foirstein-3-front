

// export default AccessibilityOptions;
import React, { useState, useEffect } from 'react';
import { Button, Drawer, Switch, FormControlLabel, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

const useStyles = makeStyles({
  drawer: {
    width: 270, // גודל קטן יותר
    padding: 22, // מרווח קטן יותר
    height: 'calc(50% - 32px)', // גובה קטן יותר
    top: '25%', // כדי למרכז את הקומפוננטה במסך
    bottom: '25%', // כדי למרכז את הקומפוננטה במסך
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    position: 'fixed',
    top: '20px',
    left: 0,
    zIndex: 1000,
    borderRadius: '25%',
    minWidth: '50px',
    minHeight: '50px',
    width: '60px',
    height: '60px',
    padding: 0,
    backgroundColor: '#ffeb3b',  // צבע רקע לנגישות
    color: '#1976d2',  // צבע טקסט לנגישות
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#fdd835',
    },
  },
  icon: {
    fontSize: '2rem',
  },
  contrastText: {
    color: 'yellow',
  },
  contrastBackground: {
    backgroundColor: 'black',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    flex: '1',
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
      .color-contrast {
        background-color: black !important;
        color: yellow !important;
      }
      .color-contrast a {
        color: pink !important;
      }
      .color-contrast input, .color-contrast textarea, .color-contrast select, .color-contrast button,
      .color-contrast .MuiInputBase-root, .color-contrast .MuiButton-root,
      .color-contrast .MuiOutlinedInput-root, .color-contrast .MuiInputLabel-root,
      .color-contrast .MuiFormLabel-root, .color-contrast .MuiFormControl-root,
      .color-contrast .MuiPaper-root, .color-contrast .MuiDrawer-paper,
      .color-contrast .MuiTypography-root, .color-contrast .MuiSwitch-root,
      .color-contrast .MuiButton-label, .color-contrast .MuiFormControlLabel-label,
      .color-contrast table, .color-contrast th, .color-contrast td {
        background-color: black !important;
        color: yellow !important;
        border: 1px solid pink !important;
      }
      .color-contrast input:focus, .color-contrast textarea:focus, .color-contrast select:focus,
      .color-contrast .MuiOutlinedInput-root.Mui-focused {
        border-color: pink !important;
        outline: none !important;
        box-shadow: 0 0 10px pink !important;
      }
      .color-contrast .MuiInputBase-input {
        color: yellow !important;
        background-color: black !important;
      }
      .color-contrast .MuiInput-underline:before {
        border-bottom: 2px solid yellow !important;
      }
      .color-contrast .MuiInput-underline:hover:not(.Mui-disabled):before {
        border-bottom: 2px solid pink !important;
      }
      .color-contrast .MuiOutlinedInput-notchedOutline {
        border-color: yellow !important;
      }
      .color-contrast .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: pink !important;
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

    if (option === 'changeColors') {
      document.body.classList.toggle('color-contrast', newSettings.changeColors);
    }

    if (option === 'addUnderlines') {
      document.body.classList.toggle('add-underlines', newSettings.addUnderlines);
    }

    if (option === 'stopAnimations') {
      const css = `
        * {
          animation: none !important;
          transition: none !important;
        }
      `;
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.id = "stopAnimationsStyle";
      styleSheet.innerText = css;
      if (newSettings.stopAnimations) {
        document.head.appendChild(styleSheet);
      } else {
        const existingStyleSheet = document.getElementById("stopAnimationsStyle");
        if (existingStyleSheet) {
          existingStyleSheet.remove();
        }
      }
    }

    if (option === 'useScreenReader') {
      if (newSettings.useScreenReader) {
        const textToRead = document.body.innerText;
        const speech = new SpeechSynthesisUtterance(textToRead);
        speech.lang = 'he-IL'; // הגדרת השפה לעברית
        window.speechSynthesis.speak(speech);
      } else {
        window.speechSynthesis.cancel();
      }
    }

    if (option === 'grayscale') {
      document.body.classList.toggle('grayscale', newSettings.grayscale);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsOpen(true)}
        className={`${classes.button} ${settings.highContrast ? classes.contrastBackground : ''}`}
      >
        <AccessibilityIcon className={classes.icon} />
      </Button>
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <div className={classes.drawer}>
          <div className={`${classes.drawerHeader} ${settings.highContrast ? classes.contrastText : ''}`}>
            <Button onClick={() => setIsOpen(false)} className={settings.highContrast ? classes.contrastText : ''}>X</Button>
            <Typography variant="h6" className={settings.highContrast ? classes.contrastText : ''}>?צריך קצת עזרה</Typography>
          </div>
          <Divider />
          <List>
            <ListItem className={classes.listItem}>
              <ListItemText primary="שימוש בקורא מסך" className={classes.listItemText} />
              <Switch checked={settings.useScreenReader} onChange={() => handleToggle('useScreenReader')} />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText primary="ניווט באמצעות מקלדת" className={classes.listItemText} />
              <Switch checked={settings.keyboardNavigation} onChange={() => handleToggle('keyboardNavigation')} />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText primary="שנה ניגודיות צבעים" className={classes.listItemText} />
              <Switch checked={settings.changeColors} onChange={() => handleToggle('changeColors')} />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText primary="צור טווח גווני אפור" className={classes.listItemText} />
              <Switch checked={settings.grayscale} onChange={() => handleToggle('grayscale')} />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText primary="הפסק תנועת אלמנטים" className={classes.listItemText} />
              <Switch checked={settings.stopAnimations} onChange={() => handleToggle('stopAnimations')} />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText primary="הגדל את הטקסט" className={classes.listItemText} />
              <Switch checked={settings.increaseTextSize} onChange={() => handleToggle('increaseTextSize')} />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText primary="הוסף קווים תחתונים" className={classes.listItemText} />
              <Switch checked={settings.addUnderlines} onChange={() => handleToggle('addUnderlines')} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default AccessibilityOptions;
