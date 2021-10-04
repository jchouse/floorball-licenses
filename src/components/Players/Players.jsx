import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';


import LinearProgress from '@material-ui/core/LinearProgress';

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

function createTableRows(players) {
  console.log(players);

  return { players };
}

function createHeadCells(t) {
  return [
    { id: 'name', numeric: false, disablePadding: true, label: t() },
    { id: 'club', numeric: false, disablePadding: false, label: 'Calories' },
    { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
    { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
    { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
  ];
}

const Players = props => {
  const {
    players,
  } = props;
  const { t } = useTranslation();
  const tableRows = createTableRows(players);
  const tableHeadCells = createHeadCells(t);

  if (!isLoaded(players)) {
    return <LinearProgress/>;
  }

  return (
      <Grid>
        Players
      </Grid>
  );
};

export default enhance(Players);
