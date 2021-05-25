import { Link } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DateFormatter from '../../../components/DateFormatter/DateFormatter';
import Pagination from '../../../components/Pagination/Pagination.jsx';
import { Avatar, Button, Cell, Grid, SelectField, Switch, TextField } from 'react-md';
import BEM from '../../../components/BEM/BEM';
import { getCurrentSeason } from '../../../utils/timing';
import './List.css';

/**
 * Players list
 */
class PlayersList extends Component {
  static defaultProps = {
    bem: new BEM('players-list'),
    playersList: {},
  };

  state = {
    offset: 0,
    itemsOnPage: 10,
    filters: {
      name: '',
      license: '',
      club: this.props.club || '',
      showUnactive: true,
    },
  };

  constructor(props) {
    super(props);

    this.state.currentSeason = getCurrentSeason(new Date());
  }

  render() {
    const { bem, playersList } = this.props,
      { offset, itemsOnPage, filters, currentSeason } = this.state;

    let _playersList = [],
      size = 0,
      listLength = 0;

    if (playersList) {
      _playersList = Object.keys(playersList).reverse();

      if (!filters.showUnactive) {
        _playersList = _playersList.filter(player => {
          const p = playersList[player];

          return p.endActivationDate >= currentSeason.start && p.endActivationDate >= currentSeason.end;
        });
      }

      if (filters.name || filters.license || filters.club) {
        if (filters.name) {
          _playersList = _playersList.filter(player => {
            const p = playersList[player];

            return !![p.firstNameEN, p.lastNameEN, p.firstNameUA, p.lastNameUA]
              .join('')
              .toLowerCase()
              .match(filters.name.toLowerCase());
          });
        }

        if (filters.license) {
          _playersList = _playersList.filter(player => {
            const p = playersList[player];

            return !!p.license.toString().match(filters.license);
          });
        }

        if (filters.club) {
          _playersList = _playersList.filter(player => {
            const p = playersList[player],
              { key } = p.club;

            return key === filters.club;
          });
        }
      }

      listLength = _playersList.length;
      size = listLength / itemsOnPage;

      _playersList = _playersList.slice(offset * itemsOnPage, offset * itemsOnPage + 10);
    }

    return <Grid className={bem.cls()}>
      <Cell size={12}>
        {this.renderControls()}
        <Grid className={bem.cls('row')}>
          <Cell className={bem.elem('controls-item').cls()}>
            <FormattedMessage
              values={{ length: listLength }}
              id='Players.items'/>
          </Cell>
        </Grid>
        {_playersList.map((playerId, index) => this.renderCard(playersList[playerId], playerId, index))}
        <Pagination offset={offset} size={Math.ceil(size)} changePage={this.changePage}/>
      </Cell>
    </Grid>;
  }

  renderControls() {
    const { bem, clubsList = {}, club, locale, intl } = this.props,
      { filters } = this.state,
      options = Object.entries(clubsList).map(([clubId, clubData]) => ({
        value: clubId,
        label: locale === 'uk' ? clubData.shortNameUA : clubData.shortNameEN,
      }));

    return (
      <Grid className={bem.elem('controls').cls()}>
        <Cell size={1} className={bem.elem('controls-item').cls()}>
          <h3 className={bem.elem('controls-item-header').cls()}>
            <FormattedMessage id='Players.filters'/>
          </h3>
        </Cell>
        <Cell size={2} className={bem.elem('controls-item').cls()}>
          <TextField
            id='floating-center-title'
            lineDirection='center'
            label={<FormattedMessage id='Players.name'/>}
            value={filters.name}
            onChange={value => this.changeFilter('name', value)}
            placeholder={intl.formatMessage({ id: 'Players.enterName' })}/>
        </Cell>
        <Cell size={2} className={bem.elem('controls-item').cls()}>
          <TextField
            id='floating-center-title'
            lineDirection='center'
            label={<FormattedMessage id='Players.license.number'/>}
            value={filters.license}
            type='number'
            onChange={value => this.changeFilter('license', value)}
            placeholder={intl.formatMessage({ id: 'Players.enterNumber' })}/>
        </Cell>
        {!club && <Cell size={2} className={bem.elem('controls-item').cls()}>
          <SelectField
            id='select-club'
            fullWidth={true}
            placeholder={intl.formatMessage({ id: 'Players.enterClub' })}
            menuItems={options}
            value={filters.club}
            onChange={value => this.changeFilter('club', value)}/>
        </Cell>}
        <Cell size={2} className={bem.elem('controls-item').cls()}>
          <Switch
            id='show-unactive'
            checked={filters.showUnactive}
            label={<FormattedMessage id='Players.filter.unactive'/>}
            name='showUnactive'
            onChange={value => this.changeFilter('showUnactive', value)}/>
        </Cell>
      </Grid>
    );
  }

  changeFilter = (name, value) => {
    const { filters } = this.state;

    filters[name] = value;

    this.setState({
      filters,
      offset: 0,
    });
  };

  changePage = (page, inc) => {
    this.setState({
      offset: this.state.offset + inc,
    });
  };

  renderCard(player, playerId, index) {
    const { bem, imagesList } = this.props,
      nowDate = new Date().getTime(),
      clubLogoURL = player.club && imagesList[player.club.photo] && imagesList[player.club.photo].downloadURL;

    return (
      <Grid
        key={index}
        className={
          bem.elem('card')
            .mods(nowDate > player.endActivationDate && 'disactive')
            .cls()
        }>
        <Cell
          size={2}
          className={bem.elem('card-item').cls()}>
          {player.photo &&
            <div key={playerId} className={bem.elem('avatar').cls()}>
              <Avatar src={player.photo.downloadURL}/>
            </div>}
          <div className={bem.elem('card-item-info').cls()}>
            <div className={bem.elem('name').cls()}>{`${player.lastNameUA} ${player.firstNameUA}`}</div>
            <div>{DateFormatter.dateForUi(player.born)}</div>
          </div>
        </Cell>
        <Cell
          size={2}
          align='middle'
          className={bem.elem('card-item').mods('club-info').cls()}>
          <Link
            className={bem.elem('club-logo').cls()}
            to={`clubs/${player.club.clubId}`}>
            {clubLogoURL &&
              <img
                className={bem.elem('club-logo-img').cls()}
                src={clubLogoURL}
                alt={player.club && player.club.shortNameUA}/>}
          </Link>
          <div className={bem.elem('card-item-info').cls()}>
            <FormattedMessage id='Players.license.type'/>
            {': '}
            <FormattedMessage id={`Players.license.${player.licenseType}`}/>
            <br/>
            <FormattedMessage id='Players.license.number'/>
            {` ${player.license}`}
          </div>
        </Cell>
        <Cell
          size={2}
          align='middle'
          className={bem.elem('card-item-info').cls()}>
          <div>
            {player.height && <span>
              <FormattedMessage id='Players.height.header'/>
              {': '}
              <FormattedMessage values={{ height: player.height }} id='Players.height.num'/>
            </span>}
            {player.weight && <span>
              {', '}
              <FormattedMessage id='Players.weight.header'/>
              {': '}
              <FormattedMessage values={{ weight: player.weight }} id='Players.weight.num'/>
            </span>}
          </div>
          <div>
            {player.position && <div>
              <FormattedMessage id='Players.position.header'/>
              {': '}
              <FormattedMessage id={`Players.position.${player.position}`}/>
              {', '}
            </div>}
            {player.side && <div>
              <FormattedMessage id='Players.side.header'/>
              {': '}
              <FormattedMessage id={`Players.side.${player.side}`}/>
            </div>}
          </div>
        </Cell>
        <Cell
          size={1}
          align='middle'>
          <Link to={`/players/${playerId}`} className={bem.elem('goto').cls('secondary-content')}>
            <Button icon primary>open_in_browser</Button>
          </Link>
        </Cell>
      </Grid>
    );
  }
}

const populates = [
  { child: 'photo', root: 'images' },
  { child: 'club', root: 'clubs', keyProp: 'key' },
];

function mapStateToProps(state) {
  const { locale, firebase, firebase: { data: { images, clubs } } } = state;

  return {
    locale,
    clubsList: clubs,
    imagesList: images,
    playersList: populate(firebase, 'players', populates),
  };
}

export default compose(
  firebaseConnect(['images', { path: 'players', populates }, 'clubs']),
  connect(mapStateToProps),
  injectIntl
)(PlayersList);
