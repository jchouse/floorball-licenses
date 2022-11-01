import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  clubLogoCell: {
    display: 'flex',
    alignItems: 'center',
  },
  clubLogo: {
    marginRight: 20,
    width: 35,
    height: 35,
    objectFit: 'scale-down',
    background: '#fff',
    borderRadius: '50%',
  },
  disabledRow: {
    '& td': {
      color: '#c6c6c6',
    },
  },
  count: {
    marginTop: 10,
  },
}));
