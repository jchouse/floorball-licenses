import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
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
  // infoTextMain: {

  // },

}));