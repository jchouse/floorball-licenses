import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { withCookies } from 'react-cookie';
import { Button, Drawer, Toolbar } from 'react-md';

import BEM from '../BEM/BEM';
import { pages } from '../../constans/location';
import NavItemLink from './NavItemLink/NavItemLink.jsx';
import KebabMenu from './KebabMenu/KebabMenu.jsx';
import './Header.css';

import { locale as changeLang, login, logout } from '../../actions/HeaderActions';

const navItems = [{
  label: <FormattedMessage id='Header.main'/>,
  to: pages.MAIN,
  exact: true,
  icon: 'home',
}, {
  label: <FormattedMessage id='Header.clubs'/>,
  to: pages.CLUBS,
  exact: true,
  icon: 'people',
}, {
  label: <FormattedMessage id='Header.players'/>,
  to: pages.PLAYERS,
  icon: 'person',
}, {
  label: <FormattedMessage id='Header.transfers'/>,
  to: pages.TRANSFERS,
  icon: 'transfer_within_a_station',
}],
  { location } = global;

/**
 * Header
 */
class Header extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    bem: new BEM('header'),
  };

  state = {
    menuVisible: false,
  };

  static getDerivedStateFromProps(props) {
    const { users, cookies, dispatch, user } = props,
      locale = cookies.get('locale');

    if (locale) {
      dispatch(changeLang(locale));
    }

    if (isLoaded(users) && user && !user.displayName) {
      props.firebase.auth().onAuthStateChanged(userData => {
        if (userData && users[userData.uid]) {
          dispatch(login(users[userData.uid]));
        }
      });
    }

    return null;
  }

  render() {
    const { user, intl } = this.props,
      { menuVisible } = this.state,
      actionsItem = [{
        label: <FormattedMessage id='Header.locale'/>,
        onClick: this.changeLang,
      }];

    if (user && user.role === 99) {
      actionsItem.push({
        label: <FormattedMessage id='Header.newClub'/>,
        to: pages.NEW_CLUB,
      }, {
        label: <FormattedMessage id='Header.newPlayer'/>,
        to: pages.NEW_PLAYER,
      }, {
        label: <FormattedMessage id='Header.newTransfer'/>,
        to: pages.NEW_TRANSFER,
      });
    }

    if (user && user.role > 20 && user.role < 31 && user.clubId) {
      actionsItem.push({
        label: <FormattedMessage id='Header.startLicenses'/>,
        to: pages.REQUEST_NEW,
      }, {
        label: <FormattedMessage id='Header.continueLicenses'/>,
        to: pages.REQUEST_CONTINUE,
      });
    }

    if (user && user.displayName) {
      actionsItem.push({
        label: <FormattedMessage id='Header.logout'/>,
        onClick: this.logOut,
      });
    } else {
      actionsItem.push({
        label: <FormattedMessage id='Header.login'/>,
        onClick: this.loginWithGoogle,
      });
    }

    return [
      <Toolbar
        key='header-toolbar'
        colored
        nav={<Button onClick={this.handleVisibility} icon>menu</Button>}
        title={intl.formatMessage({ id: 'Header.title' })}
        actions={
          <KebabMenu
            id='header-toolbar-menu'
            user={user}
            menuItems={actionsItem.map((props, i) => <NavItemLink {...props} key={i}/>)}/>
        }/>,
      <Drawer
        key='main-menu'
        id='main-menu'
        type={Drawer.DrawerTypes.TEMPORARY}
        visible={menuVisible}
        position='left'
        onVisibilityChange={this.handleVisibility}
        navItems={navItems.map(props => <NavItemLink {...props} key={props.to}/>)}/>,
    ];
  }

  handleVisibility = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  changeLang = () => {
    const { dispatch, locale, cookies } = this.props;

    cookies.set('locale', locale, { path: '/' });

    dispatch(changeLang(locale));
  };

  loginWithGoogle = () => {
    const { firebase, dispatch } = this.props,
      provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => firebase.auth().signInWithPopup(provider))
      .then(({ user }) => this.saveUser(user))
      .then(user => dispatch(login(user)))
      .catch(e => console.error(e));
  };

  async saveUser(profile) {
    const { users, firebase: { update } } = this.props,
      { email, displayName, uid, photoURL } = profile;

    if (!users[uid]) {
      await update('users', {
        ...users,
        [uid]: {
          email,
          displayName,
          photoURL,
        },
      });
    } else {
      await update(`users/${uid}`, {
        ...users.uid,
        email,
        displayName,
        photoURL,
      });
    }

    return users[uid];
  }

  logOut = () => {
    const { firebase, dispatch } = this.props;

    firebase
      .auth()
      .signOut()
      .then(() => dispatch(logout()))
      .then(() => location.href = '/');
  }
}

function mapStateToProps(state) {
  const { user, locale, routing, firebase: { data: { users } } } = state,
    _locale = locale === 'uk' ? 'en' : 'uk';

  if (users && user && users[user.uid]) {
    user.role = users[user.uid].role;
  }

  return {
    user,
    locale: _locale,
    routing,
    users,
  };
}

export default compose(
  firebaseConnect(['users']),
  connect(mapStateToProps),
  injectIntl,
  withCookies
)(Header);
