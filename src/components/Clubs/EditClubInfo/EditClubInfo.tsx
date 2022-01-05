import React from 'react';
import Helmet from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { IClub } from '../Clubs';

import { NEW_ENTITY } from '../../../constans/location';

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
};

export default function EditClubInfo({ clubs, images }: IEditClubInfoProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  
  const defaultValues = id === NEW_ENTITY ? initialValues : clubs[id];
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  const onSubmit: SubmitHandler<IClub> = data => console.log(data);

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
          photo
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
              name='fullName'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => 
                <TextField
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.fullName')}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.fullNameInt')}
                  error={Boolean(errors.fullNameInt)}
                  helperText={errors.fullNameInt && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.shortName')}
                  error={Boolean(errors.shortName)}
                  helperText={errors.shortName && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.shortNameInt')}
                  error={Boolean(errors.shortNameInt)}
                  helperText={errors.shortNameInt && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.line')}
                  error={Boolean(errors.line)}
                  helperText={errors.line && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.city')}
                  error={Boolean(errors.city)}
                  helperText={errors.city && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.region')}
                  error={Boolean(errors.region)}
                  helperText={errors.region && t('Common.required')}
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.postCode')}
                  error={Boolean(errors.postCode)}
                  helperText={errors.postCode && t('Common.required')}
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
              render={({ field }) => 
                <TextField
                  type='password'
                  variant='outlined'
                  fullWidth
                  size='small'
                  label={t('Clubs.country')}
                  error={Boolean(errors.country)}
                  helperText={errors.country && t('Common.required')}
                  {...field}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
