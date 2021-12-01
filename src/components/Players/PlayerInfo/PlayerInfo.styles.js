import makeStyles from '@mui/styles/makeStyles';

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
  photoWrapper: {
    position: 'relative',
  },
  currentClubLogoWrapper: {
    position: 'absolute',
    bottom: -25,
    right: -25,
  },
  currentClubLogo: {
    width: 100,
    height: 100,
  },
  clubLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  transferHeader: {
    marginTop: 20,
  },
  transferRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
  },
  transferText: {
    minWidth: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  transferTextRow: {
    textAlign: 'center',
  },
}));
