
import { makeStyles } from '@material-ui/core/styles';

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
}));