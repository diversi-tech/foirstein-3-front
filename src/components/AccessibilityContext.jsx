// src/contexts/AccessibilityContext.jsx

import React, { createContext, useContext, useState } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    useScreenReader: false,
    keyboardNavigation: false,
    changeColors: false,
    highContrast: false,
    stopAnimations: false,
    increaseTextSize: false,
    addUnderlines: false,
  });

  const handleToggle = (option) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [option]: !prevSettings[option] };

      if (option === 'highContrast') {
        document.body.classList.toggle('high-contrast', newSettings.highContrast);
      }

      if (option === 'increaseTextSize') {
        document.body.classList.toggle('increase-text-size', newSettings.increaseTextSize);
      }

      if (option === 'changeColors') {
        document.body.classList.toggle('change-colors', newSettings.changeColors);
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

      return newSettings;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ settings, handleToggle }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);