import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

const populates = [
  { child: 'photo', root: 'images' },
];

const enhance = compose(
  firebaseConnect([
    { path: 'players', populates },
  ]),
  connect(({ firebase }) => ({
    clubs: populate(firebase, 'players', populates),
  }))
);

function PlayerInfo(props) {
  const { id } = useParams();
  const { players } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  if (!isLoaded(players)) {
    return <LinearProgress/>;
  }

  console.log(players[id]);

  return (
    <Grid
      container
      justifyContent='center'
      spacing={4}
    >
      <Helmet>
        <title>Player</title>
      </Helmet>
    </Grid>
  );
};

export default enhance(PlayerInfo);

