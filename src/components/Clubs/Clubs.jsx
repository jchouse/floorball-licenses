import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { pages } from '../../constans/location';
import { useStyles } from './Clubs.styles';

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
  const { t } = useTranslation();
  const classes = useStyles();

  if (!isLoaded(clubs)) {
    return <LinearProgress/>;
  }

  const content = Object
    .entries(clubs)
    .map(([clubId, club]) => {
      const {
        shortNameInt,
        shortName,
        photo,
      } = club;

      return (
        <Grid key={clubId} item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card onClick={() => history.push(pages.CLUB_INFO.replace(':id', clubId))}>
            <CardActionArea>
              {photo && (
                <CardMedia
                  component='img'
                  alt={shortNameInt}
                  height='140'
                  image={photo.downloadURL}
                  title={shortNameInt}
                  className={classes.media}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant='h5' component='h5'>
                  {shortName}
                </Typography>
                <Typography gutterBottom variant='h6' component='h6'>
                  {shortNameInt}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      );
    });

  return (
    <Grid container spacing={2}>
      <Helmet>
        <title>{t('Floorball.title')}</title>
      </Helmet>
      {content}
    </Grid>
  );
}

export default enhance(Clubs);
