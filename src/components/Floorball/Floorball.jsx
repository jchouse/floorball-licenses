import React from 'react';
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
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

import { useStyles } from './Floorball.styles';

import Clubs from '../Clubs/Clubs';
import ClubInfo from '../Clubs/ClubInfo/ClubInfo';
// import EditClubCard from '../Clubs/Club/Edit/Edit.jsx';
import Players from '../Players/Players.jsx';
import PlayerInfo from '../Players/PlayerInfo/PlayerInfo';
// import EditPlayerCard from '../Players/Player/Edit/Edit.jsx';
import Transfers from '../Transfers/Transfers.jsx';
// import TransfersEdit from '../Transfers/Edit/TransfersEdit.jsx';
// import Account from '../Account/Account.jsx';
// import Requests from '../Requests/Requests.jsx';
// import NewRequest from '../Requests/New/NewRequest.jsx';

function NotFound() {
  return <h2>Воу воу полегче, еще не написали :)</h2>;
}

export default function Floorball() {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = path => () => history.push(path);

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
          <ListItem button onClick={handleMenuItemClick(`${pages.CLUBS}`)}>
            <ListItemIcon>
              <GroupIcon/>
            </ListItemIcon>
            <ListItemText primary={t('Floorball.clubs')}/>
          </ListItem>
          <ListItem button onClick={handleMenuItemClick(`${pages.PLAYERS}`)}>
            <ListItemIcon>
              <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary={t('Floorball.players')}/>
          </ListItem>
          <ListItem button onClick={handleMenuItemClick(`${pages.TRANSFERS}`)}>
            <ListItemIcon>
              <TransferWithinAStationIcon/>
            </ListItemIcon>
            <ListItemText primary={t('Floorball.transfers')}/>
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader}/>
        <Switch>
          <Route exact path='/'>
            <Redirect to='clubs'/>
          </Route>

          {/* <Route path='/clubs/:id/edit' component={EditClubCard}/> */}
          <Route path='/clubs/:id' component={ClubInfo}/>
          <Route path='/clubs' component={Clubs}/>
          <Route path='/players/:id' component={PlayerInfo}/>
          <Route path='/players' component={Players}/>

          {/*
          <Route path='transfers' component={Transfers}>
            <Route path=':id/edit' component={TransfersEdit}/>
          </Route>
          <Route path='your-account' component={Account}/>
          <Route path='requests' component={Requests}>
            <Route path='new' component={NewRequest}/>
          </Route> */}
          <Route path='*'>
            <NotFound/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
