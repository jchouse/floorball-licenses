import React from 'react';
import { useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { ref, getDatabase } from 'firebase/database';
import { useObject } from 'react-firebase-hooks/database';
import { firebaseApp } from '../../../firebaseInit';

const database = getDatabase(firebaseApp);

import { useStyles } from './ClubInfo.styles';

function ClubInfo() {
  const { id } = useParams();
  const classes = useStyles();
  const { t } = useTranslation();
  const [snapshotClubs, loadingClubs, errorClubs] = useObject(ref(database, 'clubs'));
  const [snapshotImages, loadingImages, errorImages] = useObject(ref(database, 'images'));

  if (loadingClubs || loadingImages) {
    return <LinearProgress/>;
  }

  if (errorClubs || errorImages) {
    return <div>Error: {errorClubs || errorImages}</div>;
  }

  const clubs = snapshotClubs.val();
  const images = snapshotImages.val();
  const {
    photo,
    shortName,
    shortNameInt,
    fullName,
    fullNameInt,
    phone,
    email,
    line,
    city,
    postCode,
    country,
  } = clubs[id];
  const { downloadURL } = images[photo];

  return (
    <Grid
      container
      justifyContent='center'
      spacing={4}
    >
      <Helmet>
        <title>{shortName}</title>
      </Helmet>
      <Grid
        item
        xs={10}
        md={3}
        lg={3}
      >
        {downloadURL &&
          <img
            className={classes.photo}
            src={downloadURL}
            alt={shortName}
          />
        }
      </Grid>
      <Grid
        item
        xs={10}
        md={7}
        lg={7}
      >
        <div className={classes.info}>
          <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
            {t('Clubs.fullName')}
          </Typography>
          <Typography gutterBottom variant='h3'>
            {fullName}
          </Typography>
          <Typography gutterBottom variant='h4'>
            {fullNameInt}
          </Typography>
        </div>
        <div className={classes.info}>
          <Typography gutterBottom variant='body1' className={classes.infoTextLabel}>
            {t('Clubs.shortName')}
          </Typography>
          <Typography variant='h4'>
            {shortName}
          </Typography>
          <Typography variant='h5'>
            {shortNameInt}
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

export default ClubInfo;
