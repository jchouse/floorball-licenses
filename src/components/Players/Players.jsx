import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate } from 'react-redux-firebase';

import './Players.css';

const populates = [
  { child: 'photo', root: 'images' },
  { child: 'club', root: 'clubs', keyProp: 'key' },
];

const enhance = compose(
  firebaseConnect([
    { path: 'players', populates },
  ]),
  connect(({ firebase }) => ({
    players: populate(firebase, 'players', populates),
  }))
);

/**
 * Players page
 */
const Players = props => {
    const {
      players,
    } = props;

    console.log(players);

    return (
        <div>

        </div>
    );
};

export default enhance(Players);
