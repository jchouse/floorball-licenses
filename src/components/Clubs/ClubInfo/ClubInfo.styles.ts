import { makeStyles }  from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  photo: {
    width: '100%',
    objectFit: 'contain',
  },
  info: {
    marginBottom: 20,
  },
  infoTextLabel: {
    color: theme.palette.text.secondary,
  },
}));