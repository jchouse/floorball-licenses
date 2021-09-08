import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './ClubInfo.styles';

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

function ClubInfo(props) {
  const { id } = useParams();
  const { clubs } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  if (!isLoaded(clubs)) {
    return <LinearProgress/>;
  }

  const {
    photo: {
      downloadURL,
    },
    shortNameUA,
    shortNameEN,
    fullNameUA,
    fullNameEN,
    phone,
    email,
    address: {
      line,
      city,
      postCode,
      country,
    },
  } = clubs[id];

  console.log(clubs[id]);

  return (
    <Grid
      container
      justifyContent='center'
      spacing='4'
    >
      <Helmet>
        <title>{shortNameUA}</title>
      </Helmet>
      <Grid
        item
        xs='10'
        md='3'
        lg='3'
      >
       {downloadURL &&
        <img
          className={classes.photo}
          src={downloadURL}
          alt={shortNameUA}
        />
      }
      </Grid>
      <Grid
        item
        xs='10'
        md='7'
        lg='7'
      >
        <div className={classes.info}>
          <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
            {t('Clubs.fullName')}
          </Typography>
          <Typography gutterBottom variant='h3'>
            {fullNameUA}
          </Typography>
          <Typography gutterBottom variant='h4'>
            {fullNameEN}
          </Typography>
        </div>
        <div className={classes.info}>
          <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
            {t('Clubs.shortName')}
          </Typography>
          <Typography variant='h4'>
            {shortNameUA}
          </Typography>
          <Typography variant='h5'>
            {shortNameEN}
          </Typography>
        </div>
        {phone &&
          <div className={classes.info}>
            <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
              {t('Clubs.contactPhone')}
            </Typography>
            <Typography variant='h6'>
              {phone}
            </Typography>
          </div>
        }
        {email &&
          <div className={classes.info}>
            <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
              {t('Clubs.email')}
            </Typography>
            <Typography variant='h6'>
              <a href={`mailto:${email}`}>
                {email}
              </a>
            </Typography>
          </div>
        }
        {line &&
          <div className={classes.info}>
            <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
              {t('Clubs.address')}
            </Typography>
            <Typography variant='h6'>
              {[line, city, postCode, country].join(', ')}
            </Typography>
          </div>
        }
      </Grid>
    </Grid>
  );
}



export default enhance(ClubInfo);
