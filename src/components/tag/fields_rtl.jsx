import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: outerTheme?.palette?.mode || 'light',
    },
  });

export const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const Fields_rtl = ({ children }) => (
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </CacheProvider>
);

export default Fields_rtl;