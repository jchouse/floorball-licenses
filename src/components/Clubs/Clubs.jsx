import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import { pages } from '../../constans/location';

import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const populates = [
  { child: 'photo', root: 'images' },
];

const enhance = compose(
  firebaseConnect([
    { path: 'clubs', populates },
  ]),
  connect(({ firebase }) => ({
    clubs: populate(firebase, 'clubs', populates),
  }))
);

function Clubs(props) {
  const { clubs } = props;
  const history = useHistory();

  if (!isLoaded(clubs)) {
    return <LinearProgress/>;
  }

  const content = Object
    .entries(clubs)
    .map(([clubId, club]) => {
      const {
        shortNameEN,
        shortNameUA,
        photo,
      } = club;

      console.log(club);

      return (
        <Grid key={clubId} item xs={3}>
          <Card onClick={() => history.push(`${pages.CLUBS}`)}>
            <CardActionArea>
              {photo && (
                <CardMedia
                  component='img'
                  alt={shortNameEN}
                  height='140'
                  image={`${photo.downloadURL}`}
                  title={shortNameEN}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant='h5' component='h5'>
                  {shortNameUA}
                </Typography>
                <Typography gutterBottom variant='h6' component='h6'>
                  {shortNameEN}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      );
    });

  return (
    <Grid container spacing={2}>
      {content}
    </Grid>
  );
}

export default enhance(Clubs);
