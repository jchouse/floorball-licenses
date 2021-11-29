import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Pagination from '../Pagination/Pagination.jsx';
import { Button } from 'react-md';
import BEM from '../BEM/BEM';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, populate } from 'react-redux-firebase';
import DateFormatter from '../DateFormatter/DateFormatter';
import './Transfers.css';

const headCell = [
  { id: 'license', labelI18nKey: 'Players.table.license' },
  { id: 'club', labelI18nKey: 'Players.table.club' },
  { id: 'photo', labelI18nKey: 'Players.table.photo' },
  { id: 'firstName', labelI18nKey: 'Players.table.firstName' },
  { id: 'lastName', labelI18nKey: 'Players.table.lastName' },
  { id: 'gender', labelI18nKey: 'Players.gender.header' },
  { id: 'age', labelI18nKey: 'Players.table.age' },
];

class Transfers extends React.Component {
  static defaultProps = {
    bem: new BEM('transfers'),
  };

  state = {
    offset: 0,
    itemsOnPage: 10,
  };

  render() {
    const { bem, transfersList } = this.props;

    return <div className={bem.cls()}>
      {isLoaded(transfersList) && this.renderContent(transfersList)}
    </div>;
  }

  renderContent(transfersList) {
    const { bem } = this.props;
    const { offset, itemsOnPage } = this.state;
    const listSize = Object.keys(transfersList).length;
    const size = listSize / itemsOnPage || 0;

    return [
      this.renderTransfersList(),
      listSize > itemsOnPage && <div key='transferpagination' className={bem.elem('pager').cls()}>
        <Pagination
          offset={offset}
          size={Math.ceil(size)}
          changePage={this.changePage.bind(this)}/>
      </div>,
    ];
  }

  changePage = (page, inc) => {
    this.setState({
      offset: page !== null ? page : this.state.offset + inc,
    });
  };

  renderTransfersList() {
    const { bem, transfersList } = this.props;
    const { offset, itemsOnPage } = this.state;
    const startItem = offset * itemsOnPage;
    const endItem = startItem + itemsOnPage;
    const transfersListArray = Object.keys(transfersList).reverse().slice(startItem, endItem);

    return (transfersListArray.length !== 0 && <ul key='transferlist' className={bem.elem('list').cls()}>
      {transfersListArray.map(key => this.renderTransfer(key))}
    </ul>);
  }

  renderTransfer = key => {
    const { bem, transfersList, user, imagesList } = this.props;
    const transfer = transfersList[key];
    const { player, fromClub, toClub } = transfer;

    let playerPhoto;

    let fromClubPhoto;

    let toClubPhoto;

    if (isLoaded(imagesList)) {
      playerPhoto = player.photo && imagesList[player.photo].downloadURL;
      fromClubPhoto = fromClub.photo && imagesList[fromClub.photo].downloadURL;
      toClubPhoto = toClub.photo && imagesList[toClub.photo].downloadURL;
    }

    return <li key={key} className={bem.elem('list-item').cls()}>
      <div className={bem.elem('avatar').cls()}>
        {playerPhoto && <img
          alt={`${player.firstNameUA.slice(0, 1)}${player.lastNameUA.slice(0, 1)}`}
          src={playerPhoto}
          className={bem.elem('avatar-img').cls()}/>}
      </div>
      {player && <Link
        to={`players/${player.key}`}
        className={bem.elem('card-item').cls()}
        target='_blank'>
        <div className={bem.elem('name').cls()}>{`${player.lastNameUA} ${player.firstNameUA}`}</div>
      </Link>}
      <div className={bem.elem('card-item').mods('club-info').cls()}>
        <Link to={`clubs/${fromClub.key}`} target='_blank'>
          {fromClubPhoto && <img
            src={fromClubPhoto}
            alt={fromClub.shortNameUA}
            className={bem.elem('club-logo').cls()}/>}
        </Link>
      </div>
      <div className={bem.elem('card-item').mods('about').cls()}>
        <FormattedMessage id={`Transfers.${!transfer.endDate ? 'transfer' : 'loan'}`}/>
        <div>
          <FormattedMessage id='Transfers.from'/>
          {' '}
          {DateFormatter.dateForUi(transfer.date)}
        </div>
        {transfer.endDate && <div>
          <FormattedMessage id='Transfers.to'/>
          {' '}
          {DateFormatter.dateForUi(transfer.endDate)}
        </div>}
      </div>
      <div className={bem.elem('card-item').mods('club-info').cls()}>
        <Link to={`clubs/${toClub.key}`} target='_blank'>
          {toClubPhoto && <img
            src={toClubPhoto}
            alt={toClub.shortNameUA}
            className={bem.elem('club-logo').cls()}/>}
        </Link>
      </div>
      {user.role && <Link to={`/transfers/${key}/edit`} className={bem.elem('goto').cls()}>
        <Button icon primary>open_in_browser</Button>
      </Link>}
    </li>;
  }
}

const populates = [
  { child: 'fromClub', root: 'clubs', keyProp: 'key' },
  { child: 'player', root: 'players', keyProp: 'key' },
  { child: 'toClub', root: 'clubs', keyProp: 'key' },

];

function mapStateToProps(state) {
  const { user, firebase, firebase: { data: { images } } } = state;

  return {
    user,
    transfersList: populate(firebase, 'transfers', populates),
    imagesList: images,
  };
}

export default compose(
  firebaseConnect([
    { path: '/transfers', populates },
    'images',
  ]),
  connect(mapStateToProps),
  injectIntl
)(Transfers);
