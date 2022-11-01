import React, { useCallback, useState } from 'react';
import Helmet from 'react-helmet';
import { useParams } from 'react-router-dom';
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

import { IClub } from '../Clubs';
import FileUploader from '../../FileUploader/FileUploader';
import CountrySelect from '../../Countries/CountrySelect';

import { NEW_ENTITY } from '../../../constans/location';

const database = getDatabase(firebaseApp);

const StyledLogo = styled('img')({
  maxWidth: '100%',
});

interface IEditClubInfoProps {
  clubs: Record<string, IClub>;
  images: Record<string, { downloadURL: string }>;
}

const initialValues: IClub = {
  photo: '',
  shortName: '',
  shortNameInt: '',
  fullName: '',
  fullNameInt: '',
  phone: '',
  email: '',
  url: '',
  line: '',
  city: '',
  region: '',
  postCode: '',
  country: '',
  founded: new Date().valueOf(),
  added: new Date().valueOf(),
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditClubInfo({ clubs, images }: IEditClubInfoProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<AlertColor | null>(null);
  
  let defaultValues = initialValues;
  let imageUrl = '';
  
  if (id !== NEW_ENTITY) {
    defaultValues = clubs[id];
    
    const photo = images[defaultValues.photo];
    const { downloadURL = '' } = photo || {};
    
    imageUrl = downloadURL;
  }
  
  const [image, setImage] = useState(imageUrl);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues });

  const onSubmit: SubmitHandler<IClub> = async (data) => {
    let clubId = id;

    if (clubId === NEW_ENTITY) {
      clubId = push(child(ref(database), db_paths.Clubs)).key || '';
    }

    if (!clubId) {
      setMessage('error');
      return;
    }

    const updates: Partial<Record<string, IClub>> = {};

    data.added = new Date(data.added).valueOf();
    data.founded = new Date(data.founded).valueOf();

    updates[`/${db_paths.Clubs}/` + clubId] = {
      ...data,
    };

    update(ref(database), updates)
      .then(() => {
        setMessage('success');
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
            alt='clubs logo'
          />}
          <FileUploader
            sizeLimitMB={2}
            onUploaded={uploadImageHandler}
          />
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
              name='added'
              control={control}
              render={({ field }) =>
                <DesktopDatePicker
                  inputFormat='dd/MM/yyyy'
                  label={t('Clubs.added')}
                  disabled={true}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='fullName'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.fullName')}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='fullNameInt'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.fullNameInt')}
                  error={Boolean(errors.fullNameInt)}
                  helperText={errors.fullNameInt && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='shortName'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.shortName')}
                  error={Boolean(errors.shortName)}
                  helperText={errors.shortName && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='shortNameInt'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.shortNameInt')}
                  error={Boolean(errors.shortNameInt)}
                  helperText={errors.shortNameInt && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='founded'
              control={control}
              render={({ field }) =>
                <DesktopDatePicker
                  inputFormat='dd/MM/yyyy'
                  label={t('Clubs.founded')}
                  renderInput={params => <TextField {...params}/>}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='phone'
              control={control}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.contactPhone')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='email'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='url'
              control={control}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.url')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='line'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.line')}
                  error={Boolean(errors.line)}
                  helperText={errors.line && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='city'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.city')}
                  error={Boolean(errors.city)}
                  helperText={errors.city && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='region'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.region')}
                  error={Boolean(errors.region)}
                  helperText={errors.region && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='postCode'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  variant='outlined'
                  fullWidth
                  label={t('Clubs.postCode')}
                  error={Boolean(errors.postCode)}
                  helperText={errors.postCode && t('Floorball.form.required')}
                  {...field}
                />
              }
            />
          </Grid>
          <Grid item>
            <Controller
              name='country'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => 
                <CountrySelect
                  label={t('Clubs.country')}
                  value={value}
                  onChange={onChange}
                />
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
