import React from 'react';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';

import { useStyles } from './Transfers.styles';

const headCell = [
  { id: 'date', labelI18nKey: 'Players.table.license' },
  { id: 'player', labelI18nKey: 'Players.table.club' },
  { id: 'givingClub', labelI18nKey: 'Players.table.photo' },
  { id: 'recivingClub', labelI18nKey: 'Players.table.firstName' },
  { id: 'endDate', labelI18nKey: 'Players.table.lastName' },
];

export default function Transfers() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid>
      <Helmet>
        <title>{t('Players.list.title')}</title>
      </Helmet>
      <Paper
        className={classes.tableWrapper}
      >
        <TableContainer>
          <Table
            aria-labelledby='tableTitle'
            aria-label='transfers table'
          >
            <TableHead>
              <TableRow>
                {headCell.map(headCell => (
                  <TableCell
                    key={headCell.id}
                  >
                    {t(headCell.labelI18nKey)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/*
            <PlayersTableRows
              players={
                playersRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              }
              translator={t}
              clubs={clubs}
              images={images}
              classes={classes}
              handleClubClick={handleClubClick}
              handleClick={handlePlayerRowClick}
            /> */}
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
}
// class Transfers extends React.Component {
//   static defaultProps = {
//     bem: new BEM('transfers'),
//   };

//   state = {
//     offset: 0,
//     itemsOnPage: 10,
//   };

//   render() {
//     const { bem, transfersList } = this.props;

//     return <div className={bem.cls()}>
//       {isLoaded(transfersList) && this.renderContent(transfersList)}
//     </div>;
//   }

//   renderContent(transfersList) {
//     const { bem } = this.props;
//     const { offset, itemsOnPage } = this.state;
//     const listSize = Object.keys(transfersList).length;
//     const size = listSize / itemsOnPage || 0;

//     return [
//       this.renderTransfersList(),
//       listSize > itemsOnPage && <div key='transferpagination' className={bem.elem('pager').cls()}>
//         <Pagination
//           offset={offset}
//           size={Math.ceil(size)}
//           changePage={this.changePage.bind(this)}/>
//       </div>,
//     ];
//   }

//   changePage = (page, inc) => {
//     this.setState({
//       offset: page !== null ? page : this.state.offset + inc,
//     });
//   };

//   renderTransfersList() {
//     const { bem, transfersList } = this.props;
//     const { offset, itemsOnPage } = this.state;
//     const startItem = offset * itemsOnPage;
//     const endItem = startItem + itemsOnPage;
//     const transfersListArray = Object.keys(transfersList).reverse().slice(startItem, endItem);

//     return (transfersListArray.length !== 0 && <ul key='transferlist' className={bem.elem('list').cls()}>
//       {transfersListArray.map(key => this.renderTransfer(key))}
//     </ul>);
//   }

//   renderTransfer = key => {
//     const { bem, transfersList, user, imagesList } = this.props;
//     const transfer = transfersList[key];
//     const { player, fromClub, toClub } = transfer;

//     let playerPhoto;

//     let fromClubPhoto;

//     let toClubPhoto;

//     if (isLoaded(imagesList)) {
//       playerPhoto = player.photo && imagesList[player.photo].downloadURL;
//       fromClubPhoto = fromClub.photo && imagesList[fromClub.photo].downloadURL;
//       toClubPhoto = toClub.photo && imagesList[toClub.photo].downloadURL;
//     }

//     return <li key={key} className={bem.elem('list-item').cls()}>
//       <div className={bem.elem('avatar').cls()}>
//         {playerPhoto && <img
//           alt={`${player.firstNameUA.slice(0, 1)}${player.lastNameUA.slice(0, 1)}`}
//           src={playerPhoto}
//           className={bem.elem('avatar-img').cls()}/>}
//       </div>
//       {player && <Link
//         to={`players/${player.key}`}
//         className={bem.elem('card-item').cls()}
//         target='_blank'>
//         <div className={bem.elem('name').cls()}>{`${player.lastNameUA} ${player.firstNameUA}`}</div>
//       </Link>}
//       <div className={bem.elem('card-item').mods('club-info').cls()}>
//         <Link to={`clubs/${fromClub.key}`} target='_blank'>
//           {fromClubPhoto && <img
//             src={fromClubPhoto}
//             alt={fromClub.shortNameUA}
//             className={bem.elem('club-logo').cls()}/>}
//         </Link>
//       </div>
//       <div className={bem.elem('card-item').mods('about').cls()}>
//         <FormattedMessage id={`Transfers.${!transfer.endDate ? 'transfer' : 'loan'}`}/>
//         <div>
//           <FormattedMessage id='Transfers.from'/>
//           {' '}
//           {DateFormatter.dateForUi(transfer.date)}
//         </div>
//         {transfer.endDate && <div>
//           <FormattedMessage id='Transfers.to'/>
//           {' '}
//           {DateFormatter.dateForUi(transfer.endDate)}
//         </div>}
//       </div>
//       <div className={bem.elem('card-item').mods('club-info').cls()}>
//         <Link to={`clubs/${toClub.key}`} target='_blank'>
//           {toClubPhoto && <img
//             src={toClubPhoto}
//             alt={toClub.shortNameUA}
//             className={bem.elem('club-logo').cls()}/>}
//         </Link>
//       </div>
//       {user.role && <Link to={`/transfers/${key}/edit`} className={bem.elem('goto').cls()}>
//         <Button icon primary>open_in_browser</Button>
//       </Link>}
//     </li>;
//   }
// }

// const populates = [
//   { child: 'fromClub', root: 'clubs', keyProp: 'key' },
//   { child: 'player', root: 'players', keyProp: 'key' },
//   { child: 'toClub', root: 'clubs', keyProp: 'key' },

// ];

// function mapStateToProps(state) {
//   const { user, firebase, firebase: { data: { images } } } = state;

//   return {
//     user,
//     transfersList: populate(firebase, 'transfers', populates),
//     imagesList: images,
//   };
// }

// export default compose(
//   firebaseConnect([
//     { path: '/transfers', populates },
//     'images',
//   ]),
//   connect(mapStateToProps),
//   injectIntl
// )(Transfers);
