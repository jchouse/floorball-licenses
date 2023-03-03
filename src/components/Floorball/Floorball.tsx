import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { pages } from '../../constans/location';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import TranslateIcon from '@mui/icons-material/Translate';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

import { useStyles } from './Floorball.styles';

import Clubs from '../Clubs/Clubs';
import Players from '../Players/Players';
import Transfers from '../Transfers/Transfers';
import Auth from '../Auth/Auth';

function NotFound() {
  return <h2>Easy, this page not alowed for now.</h2>;
}

const suportedLanguagesMap = {
  en: 'en',
  uk: 'uk',
};

export default function Floorball() {
  const history = useHistory();
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const openTransltor = Boolean(anchorEl);
  const handleClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleTranslateClick = useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  }, [setAnchorEl]);

  const handleDrawerOpen = useCallback((event) => {
    event.stopPropagation();
    setOpen(true);
  }, [setOpen]);

  const handleDrawerClose = useCallback((event) => {
    event.stopPropagation();
    setOpen(false);
  }, [setOpen]);

  const handleMenuItemClick = (path: string) => () => history.push(path);

  const handleLanguageChange = (value: string) => () => {
    i18n.changeLanguage(value);
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            id='drawer-open-button'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            className={clsx(classes.menuButton, open && classes.hide)}
            size='large'
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant='h6' noWrap>
            {t('Floorball.title')}
          </Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              color='inherit'
              id='translate-button'
              aria-controls='translate-menu'
              aria-haspopup='true'
              aria-expanded={openTransltor ? 'true' : undefined}
              onClick={handleTranslateClick}
            >
              <TranslateIcon/>
            </IconButton>
            <Menu
              id='translate-menu'
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={openTransltor}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLanguageChange(suportedLanguagesMap.en)} disableRipple>
                Eng
              </MenuItem>
              <MenuItem onClick={handleLanguageChange(suportedLanguagesMap.uk)} disableRipple>
                Укр
              </MenuItem>
            </Menu>
            <Auth/>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose} size='large'>
            <ChevronLeftIcon/>
          </IconButton>
        </div>
        <Divider/>
        <List>
          <ListItemButton onClick={handleMenuItemClick(`${pages.CLUBS}`)}>
            <ListItemIcon>
              <GroupIcon/>
            </ListItemIcon>
            <ListItemText primary={t('Floorball.clubs')}/>
          </ListItemButton>
          <ListItemButton onClick={handleMenuItemClick(`${pages.PLAYERS}`)}>
            <ListItemIcon>
              <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary={t('Floorball.players')}/>
          </ListItemButton>
          <ListItemButton onClick={handleMenuItemClick(`${pages.TRANSFERS}`)}>
            <ListItemIcon>
              <TransferWithinAStationIcon/>
            </ListItemIcon>
            <ListItemText primary={t('Floorball.transfers')}/>
          </ListItemButton>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader}/>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='clubs'/>}/>
          <Route path={pages.CLUBS} component={Clubs}/>
          <Route path={pages.PLAYERS} component={Players}/>
          <Route path={pages.TRANSFERS} component={Transfers}/>
          <Route path='*'>
            <NotFound/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
