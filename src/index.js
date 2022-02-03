import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import './i18n';

import Floorball from './components/Floorball/Floorball.jsx';
import { RolesContext } from './components/RolesContext/RolesContext';

import WebFontLoader from 'webfontloader';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from './theme';

import { Roles } from './constans/settings';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

const App = () => {
  const [role, setRole] = React.useState(Roles.GUEST);

  return (
    <CookiesProvider>
      <RolesContext.Provider value={{ role, setRole }}>
        <Router>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline/>
                <Floorball/>
              </LocalizationProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </Router>
      </RolesContext.Provider>
    </CookiesProvider>
  );
};

render(<App/>, document.getElementById('root'));
