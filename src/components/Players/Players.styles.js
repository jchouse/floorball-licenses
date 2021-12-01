import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  clubLogoCell: {
    display: 'flex',
    alignItems: 'center',
  },
  clubLogo: {
    marginRight: 20,
  },
  disabledRow: {
    '& td': {
      color: '#c6c6c6',
    },
  },
  tableWrapper: {
    marginTop: 30,
  },
  count: {
    marginTop: 10,
  },
}));