import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { pages } from '../../constans/location';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';

import { useStyles } from './FloorballStyles';

// import Header from '../Header/Header.jsx';
import Clubs from '../Clubs/Clubs.jsx';
// import ClubCard from '../Clubs/Club/Club.jsx';
// import EditClubCard from '../Clubs/Club/Edit/Edit.jsx';
// import Players from '../Players/Players.jsx';
// import PlayerCard from '../Players/Player/Player.jsx';
// import EditPlayerCard from '../Players/Player/Edit/Edit.jsx';
// import Transfers from '../Transfers/Transfers.jsx';
// import TransfersEdit from '../Transfers/Edit/TransfersEdit.jsx';
// import Account from '../Account/Account.jsx';
// import Requests from '../Requests/Requests.jsx';
// import NewRequest from '../Requests/New/NewRequest.jsx';

function NotFound() {
  return <h2>Воу воу полегче, еще не написали :)</h2>;
}

// const layoutOptions = {
//   "showNav": "function",
//   "hideNav": "function",
//   "baseId": "custom-layout",
//   "layout": "full-height",
//   "visible": true,
//   "fixedAppBar": true,
//   "isMiniable": false,
// };

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
          <IconButton onClick={handleDrawerClose}>
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
          {/* <Route path='/clubs/:id' component={ClubCard}/> */}
          <Route path='/clubs' component={Clubs}/>

          {/* <Route path='players' component={Players}>
            <Route path=':id' component={PlyerCard}/>
            <Route path=':id/edit' component={EditPlayerCard}/>
          </Route>
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
