import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  logoWrapper: {
    overflow: 'hidden',
    width: 250,
    height: 250,
    margin: 'auto',
    border: '2px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '100%',
    background: '#bdbdbd',
    lineHeight: 250,
  },
  logo: {
    display: 'block',
    width: 'auto',
    height: '100%',
    margin: 'auto',
  },
  clubLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  transferText: {
    lineHeight: '38px',
  },
}));
