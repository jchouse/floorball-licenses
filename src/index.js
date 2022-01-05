import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import './i18n';

import Floorball from './components/Floorball/Floorball.jsx';

import WebFontLoader from 'webfontloader';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from './theme';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

render(
  <CookiesProvider>
    <Router>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Floorball/>
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>
  </CookiesProvider>,
  document.getElementById('root')
);
