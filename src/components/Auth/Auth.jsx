import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';

import { pages } from '../../constans/location';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { ref, set, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  getAuth,
  setPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  browserLocalPersistence,
  signOut,
} from 'firebase/auth';
import { firebaseApp } from '../../firebaseInit';

const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

function saveUser(user) {
  set(ref(database, `users/${user.uid}`), {
    email: user.email,
  });
}

function stringToColor(string) {
  let hash = 0;

  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;

    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function Auth() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const { t } = useTranslation();
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [snapshotUsers, loadingUsers, errorUsers] = useObject(ref(database, 'users'));

  if (errorUsers || errorAuth) {
    console.log('errorUsers', errorUsers);
    console.log('errorAuth', errorAuth);
    signOut(auth);
  }

  if (loadingAuth || loadingUsers) {
    return <CircularProgress color='inherit'/>;
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const users = snapshotUsers.val();

  const handleLogin = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const provider = new GoogleAuthProvider();

        return signInWithPopup(auth, provider);
      })
      .then(result => {
        const { user } = result;

        if (!users || !(users && users[user.uid])) {
          saveUser(user);
        }
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
      });
  };

  let content;

  if (user && users && users[user.uid]) {
    const { role } = users[user.uid];

    let avatarContent = stringAvatar(user.displayName);

    if (user.photoURL) {
      avatarContent = {
        alt: user.displayName,
        src: user.photoURL,
      };
    }

    content = (
      <>
        <Avatar
          ref={anchorRef}
          id='composition-button'
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          {...avatarContent}
        />
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement='bottom-start'
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='composition-menu'
                    aria-labelledby='composition-button'
                  >
                    {role >= 90 && [
                      <MenuItem key='create-club' onClick={handleClose}>
                        <Link to={generatePath(pages.EDIT_CLUB, { id: 'new' })}>{t('Auth.createClub')}</Link>
                      </MenuItem>,
                    ]}
                    <MenuItem
                      onClick={event => {
                        handleClose(event);
                        signOut(auth);
                      }}
                    >
                      {t('Auth.logout')}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  } else {
    content = (
      <Button
        color='inherit'
        onClick={handleLogin}
      >
        {t('Auth.login')}
      </Button>
    );
  }

  return content;
}
