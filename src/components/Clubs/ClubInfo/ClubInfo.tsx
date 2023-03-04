import React from 'react';
import Helmet from 'react-helmet';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import EditIcon from '@mui/icons-material/Edit';

import { IClub } from '../Clubs';

import { useStyles } from './ClubInfo.styles';
import { pages } from '../../../constans/location';
import { Roles } from '../../../constans/settings';
import { regions } from '../../RegionSelector/Regions';

interface IClubInfoProps {
  clubs: Record<string, IClub>;
  images: Record<string, { downloadURL: string }>;
  role: Roles;
}

function ClubInfo({ clubs, images, role }: IClubInfoProps) {
  const { id } = useParams() as { id: string };
  const classes = useStyles();
  const { t, i18n } = useTranslation();
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
    region,
    country,
  } = clubs[id];
  const { downloadURL } = images[photo];
  const navigate = useNavigate();

  const handleEditClubClick  = React.useCallback((event) => {
    navigate(generatePath(`${pages.CLUBS}/${pages.EDIT_CLUB}`, { id }));
  } , [navigate, id]);

  const lang = i18n.language === 'en' ? 'en' : 'uk';

  const regionObj = regions.find(reg => reg.id === region);
  const regionString = regionObj ? regionObj[lang] : '';
  const countryString = countries.getName(country, lang);

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
              {[line, city, regionString, postCode, countryString].join(', ')}
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
