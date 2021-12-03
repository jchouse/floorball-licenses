import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import './i18n';

// import { initializeApp } from 'firebase/app';
// import 'firebase/auth';
// import firebaseConfig from './firebaseVars';

import Floorball from './components/Floorball/Floorball.jsx';

import WebFontLoader from 'webfontloader';
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from './theme';

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
