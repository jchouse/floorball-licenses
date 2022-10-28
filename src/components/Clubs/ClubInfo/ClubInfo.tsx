import React from 'react';
import Helmet from 'react-helmet';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import EditIcon from '@mui/icons-material/Edit';

import { IClub } from '../Clubs';

import { useStyles } from './ClubInfo.styles';
import { pages } from '../../../constans/location';
import { Roles } from '../../../constans/settings';

interface IClubInfoProps {
  clubs: Record<string, IClub>;
  images: Record<string, { downloadURL: string }>;
  role: Roles;
}

function ClubInfo({ clubs, images, role }: IClubInfoProps) {
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const { t } = useTranslation();
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
  const history = useHistory();
  const { push } = history;

  const handleEditClubClick  = React.useCallback((event) => {
    push(generatePath(pages.EDIT_CLUB, { id }));
  } , [push, id]);

  return (
    <Grid
      container
      justifyContent='center'
      spacing={2}
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
          <Typography gutterBottom variant='h4'>
            {fullName}
          </Typography>
          <Typography gutterBottom variant='h5'>
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
      {role === Roles.ADMIN && (
        <SpeedDial
          onClick={handleEditClubClick}
          ariaLabel={t('Floorball.editClub')}
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<EditIcon/>}
        />
      )}
    </Grid>
  );
}

export default ClubInfo;
