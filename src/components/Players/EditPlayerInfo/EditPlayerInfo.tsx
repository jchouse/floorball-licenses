import React, { useCallback, useState } from 'react';
import Helmet from 'react-helmet';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { getDatabase, ref, update, push, child } from 'firebase/database';
import { firebaseApp } from '../../../firebaseInit';
import { db_paths } from '../../../db/db_constans';

import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

import { IClub } from '../../Clubs/Clubs';
import { IImage } from '../../FileUploader/FileUploader';
import { IPlayer } from '../Players';
import FileUploader from '../../FileUploader/FileUploader';
import CountrySelect from '../../Countries/CountrySelect';
import { clubsListDropdown } from '../../Clubs/ClubsListDropdown/ClubsListDropdown';
import {
  activeSeason,
} from '../../../constans/settings';

import { NEW_ENTITY, pages } from '../../../constans/location';
import { gendersMap } from '../PlayersList/PlayersList';

const database = getDatabase(firebaseApp);

const StyledLogo = styled('img')({
  maxWidth: '100%',
});

export enum Position {
  Goalkeeper = 'GOALIE',
  Defender = 'DEFENDER',
  Forward = 'FORWARD',
}

export enum Side {
  Left = 'L',
  Right = 'R',
}

interface IEditPlayerInfoProps {
  clubs: Record<string, IClub>;
  images: Record<string, IImage>;
  players: Record<string, IPlayer>;
  counter: number;
}

const initialValues: IPlayer = {
  born: new Date().valueOf(),
  citizenship: 'UA',
  firstClub: '',
  firstNameInt: '',
  firstName: '',
  gender: '',
  height: '',
  lastNameInt: '',
  lastName: '',
  license: 0,
  licenseType: '',
  photo: '',
  position: '',
  registrDate: new Date().valueOf(),
  side: '',
  secondName: '',
  weight: '',
  lastTransfer: '',
  lastActiveSeason: new Date().valueOf(),
  currentClub: '',
  uniqueExternId: '',
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditPlayerInfo({ players, images, clubs, counter }: IEditPlayerInfoProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [message, setMessage] = useState<AlertColor | null>(null);
  const isNew = id === NEW_ENTITY;

  let defaultValues = initialValues;
  let imageUrl = '';

  if (!isNew) {
    defaultValues = players[id];
    
    const photo = images[defaultValues.photo];
    const { downloadURL = '' } = photo || {};
    
    imageUrl = downloadURL;
  } else {
    defaultValues.license = ++counter;
  }

  const [image, setImage] = useState(imageUrl);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues });

  const onSubmit: SubmitHandler<IPlayer> = async (data) => {
    let playerId = id;
    const updates: Partial<Record<string, IPlayer | number>> = {};

    if (isNew) {
      playerId = push(child(ref(database), db_paths.Players)).key || '';
      updates[`/${db_paths.CountersPlayersID}/`] = data.license;
    }


    if (!playerId) {
      setMessage('error');
      return;
    }

    if (data.born) {
      data.born = new Date(data.born).valueOf();
    }

    if (data.registrDate) {
      data.registrDate = new Date(data.registrDate).valueOf();
    }

    updates[`/${db_paths.Players}/` + playerId] = {
      ...data,
    };

    update(ref(database), updates)
      .then(() => {
        setMessage('success');
        history.push(generatePath(pages.PLAYER_INFO, { id: playerId }));
      })
      .catch(() => {
        setMessage('error');
      });
  };

  const handleClose = useCallback(() => {
    setMessage(null);
  }, []);

  const uploadImageHandler = useCallback((imageId: string, downloadURL: string) => {
    setValue('photo', imageId);
    setImage(downloadURL);
  }, [setValue]);

  const handleClearPhoto = useCallback(() => {
    setValue('photo', '');
    setImage('');
  } , [setValue]);

  const clubsItems = React.useMemo(() => clubsListDropdown(clubs), [clubs]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        justifyContent='center'
        spacing={4}
      >
        <Helmet>
          <title>{t('Floorball.title')}</title>
        </Helmet>
        <Grid
          item
          xs={10}
          md={3}
          lg={3}
        >
          {image && <StyledLogo
            src={image}
            alt='players photo'
          />}
          <FileUploader
            sizeLimitMB={2}
            onUploaded={uploadImageHandler}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleClearPhoto}
          >
            {t('Players.clearPhoto')}
          </Button>
        </Grid>
        <Grid
          item
          xs={10}
          md={5}
          lg={5}
          container
          spacing={4}
          flexDirection='column'
        >
          <Grid item>
            <Controller
              name='registrDate'
              control={control}
              render={({ field }) =>
                <DesktopDatePicker
                  label={t('Players.registrDate')}
                  disabled={true}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='lastActiveSeason'
              control={control}
              render={({ field }) =>
                <DesktopDatePicker
                  label={t('Players.endActivationDate.label')}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='license'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.license.header')}
                  disabled={true}
                  error={Boolean(errors.license)}
                  helperText={errors.license && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='firstClub'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <FormControl
                  fullWidth
                  variant='outlined'
                  disabled={!isNew}
                  error={Boolean(errors.firstClub)}
                >
                  <InputLabel id='club-select'>{t('Players.firstClub')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Players.firstClub')}
                    labelId='club-select'
                  >
                    <MenuItem value={''}>{t('Players.choseCLub')}</MenuItem>
                    {clubsItems.map(club => (
                      <MenuItem key={club.value} value={club.value}>{club.label}</MenuItem>
                    ))}
                  </Select>
                  {Boolean(errors.firstClub) && <FormHelperText error={true}>{t('Floorball.form.required')}</FormHelperText>}
                </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='firstName'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.firstName.label')}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='secondName'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.secondName.label')}
                  error={Boolean(errors.secondName)}
                  helperText={errors.secondName && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='lastName'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.lastName.label')}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='born'
              control={control}
              render={({ field }) =>
                <DesktopDatePicker
                  label={t('Players.born.label')}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='uniqueExternId'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.uniqueExternId')}
                  error={Boolean(errors.uniqueExternId)}
                  helperText={errors.uniqueExternId && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='gender'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <FormControl
                  fullWidth
                  error={Boolean(errors.uniqueExternId)}
                >
                  <InputLabel id='gender-select-label'>{t('Players.gender.header')}</InputLabel>
                  <Select
                    {...field}
                    labelId='gender-select-label'
                    id='gender-select'
                    label={t('Players.gender.header')}
                  >
                    {Object.values(gendersMap).map(gender => (
                      <MenuItem key={gender} value={gender}>{t(`Players.gender.${gender}`)}</MenuItem>
                    ))}
                  </Select>
                  {Boolean(errors.uniqueExternId) && <FormHelperText error={true}>{t('Floorball.form.required')}</FormHelperText>}
                </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='licenseType'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
              <FormControl fullWidth>
                <InputLabel id='license-type-select'>{t('Players.license.type')}</InputLabel>
                <Select
                  labelId='license-type-select'
                  id='license-type-select'
                  label={t('Players.license.type')}
                  {...field}
                >
                  {[
                    activeSeason.possibleLiciensies.map(license => (
                      <MenuItem key={license.value} value={license.value}>{license.name}</MenuItem>
                    )),
                  ]}
                </Select>
              </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='citizenship'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => 
                <CountrySelect
                  label={t('Players.citizenship.label')}
                  value={value}
                  onChange={onChange}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='firstNameInt'
              control={control}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.firstNameInt.label')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='lastNameInt'
              control={control}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.lastNameInt.label')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='height'
              control={control}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.height.header')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='weight'
              control={control}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Players.weight.header')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='position'
              control={control}
              render={({ field }) => 
                <FormControl
                  fullWidth
                  variant='outlined'
                >
                  <InputLabel id='position-select'>{t('Players.position.header')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Players.position.header')}
                    labelId='position-select'
                  >
                    <MenuItem value={''}>{t('Players.filter.all')}</MenuItem>
                    <MenuItem value={Position.Goalkeeper}>{t(`Players.position.${Position.Goalkeeper}`)}</MenuItem>
                    <MenuItem value={Position.Defender}>{t(`Players.position.${Position.Defender}`)}</MenuItem>
                    <MenuItem value={Position.Forward}>{t(`Players.position.${Position.Forward}`)}</MenuItem>
                  </Select>
                </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='side'
              control={control}
              render={({ field }) => 
                <FormControl
                  fullWidth
                  variant='outlined'
                >
                  <InputLabel id='side-select'>{t('Players.side.header')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Players.side.header')}
                    labelId='side-select'
                  >
                    <MenuItem value={''}>{t('Players.filter.all')}</MenuItem>
                    <MenuItem value={Side.Left}>{t(`Players.side.${Side.Left}`)}</MenuItem>
                    <MenuItem value={Side.Right}>{t(`Players.side.${Side.Right}`)}</MenuItem>
                  </Select>
                </FormControl>
              }
            />
          </Grid>
          <Grid item>
            <Button type='submit' variant='contained' color='primary'>
              {t('Floorball.form.save')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message || 'success'}>
          {t(`Floorball.form.${message}`)}
        </Alert>
      </Snackbar>
    </form>
  );
}
