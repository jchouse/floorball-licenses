import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { IClub } from '../Clubs';
import { useHistory, generatePath } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { pages } from '../../../constans/location';

import { useStyles } from './ClubsList.styles';

interface IClubsListProps {
  clubs: Record<string, IClub>;
  images: Record<string, { downloadURL: string }>;
}

function ClubsList({ clubs, images }: IClubsListProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  const content = Object
    .entries(clubs)
    .map(([clubId, club]) => {
      const {
        shortNameInt,
        shortName,
        photo,
      } = club;
      const logo = images[photo];

      return (
        <Grid key={clubId} item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card onClick={() => history.push(generatePath(pages.CLUB_INFO, { id: clubId }))}>
            <CardActionArea>
              {logo && (
                <CardMedia
                  component='img'
                  alt={shortNameInt}
                  height='140'
                  image={logo.downloadURL}
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

export default ClubsList;