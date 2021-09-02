import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, GridCell, Grid } from 'react-md';
import BEM from '../../BEM/BEM';
import DateFormatter from '../../DateFormatter/DateFormatter';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, populate } from 'react-redux-firebase';
import './Player.css';
import Countries from '../../../components/Countries/Countries';

/**
 * Player Card
 */
class Player extends Component {
  static defaultProps = {
    bem: new BEM('player-card'),
  };

  state = {};

  render() {
    const { bem, params: { id }, playerData, user: { role }, locale } = this.props;

    let content = '';

    if (isLoaded(playerData)) {
      const {
        license,
        lastNameUA,
        firstNameUA,
        secondNameUA,
        firstNameEN,
        lastNameEN,
        height,
        weight,
        position,
        side,
        born,
        citizenship,
        licenseType,
        gender,
        club,
        photo,
      } = playerData;
      const logo = photo && photo.downloadURL;

      content = (
        <Grid className={bem.cls()}>
          <GridCell offset={2} size={4} className={bem.elem('main-logo').cls()}>
            <div className={bem.elem('main-logo-wrapper').cls()}>
              <img className={bem.elem('main-logo-img').cls()} src={logo} alt={`${lastNameUA} ${firstNameUA}`}/>
            </div>
            {this.renderClub(club)}
          </GridCell>
          <GridCell size={4} className={bem.elem('main-info').cls()}>
            {role >= 99 && <div className={bem.elem('info').cls()}>
              <Button
                raised
                primary
                href={`/players/${id}/edit`}
                iconChildren='mode_edit'>
                Edit
              </Button>
            </div>}
            <div className={bem.elem('info').cls()}>
              <div className={bem.elem('info-text').mods('label').cls()}>
                <FormattedMessage id='Players.license.header'/>
              </div>
              <div className={bem.elem('info-text').mods('main').cls()}>
                {license}
              </div>
              {licenseType && this.renderRow(
                <FormattedMessage id='Players.license.type'/>,
                <FormattedMessage id={`Players.license.${licenseType}`}/>)}
            </div>
            {this.renderRow(
              <FormattedMessage id='Players.name'/>,
              `${lastNameUA} ${firstNameUA} ${secondNameUA}`)}
            {this.renderRow(
              <FormattedMessage id='Players.born.label'/>,
              DateFormatter.dateForUi(born))}
            {citizenship && this.renderRow(
              <FormattedMessage id='Players.citizenship.label'/>,
              Countries.getCountry(citizenship, locale))}
            {(firstNameEN || lastNameEN) &&
              this.renderRow(<FormattedMessage id='Players.nameEN'/>, `${lastNameEN} ${firstNameEN}`)}
            {height && this.renderRow(
              <FormattedMessage id='Players.height.header'/>,
              <FormattedMessage values={{ height }} id='Players.height.num'/>)}
            {weight && this.renderRow(
              <FormattedMessage id='Players.weight.header'/>,
              <FormattedMessage values={{ weight }} id='Players.weight.num'/>)}
            {position && this.renderRow(
              <FormattedMessage id='Players.position.header'/>,
              <FormattedMessage id={`Players.position.${position}`}/>)}
            {side && this.renderRow(
              <FormattedMessage id='Players.side.header'/>,
              <FormattedMessage id={`Players.side.${side}`}/>)}
            {gender && this.renderRow(
              <FormattedMessage id='Players.gender.header'/>,
              <FormattedMessage id={`Players.gender.${gender}`}/>)}
          </GridCell>
        </Grid>
      );
    } else {
      content = (
        <div className={bem.cls('container')}>
          <div className=''>
            <div className='progress'>
              <div className='indeterminate'/>
            </div>
          </div>
        </div>
      );
    }

    return content;
  }

  renderClub(club) {
    const { bem, images } = this.props;
    // let licenseDate = '';

    // if (club.endDate && club.startDate) {
    //     const sd = new Date(club.startDate),
    //         ed = new Date(club.endDate),
    //         sdm = `00${sd.getMonth() + 1}`.slice(-2),
    //         sdy = sd.getFullYear(),
    //         edm = `00${ed.getMonth() + 1}`.slice(-2),
    //         edy = ed.getFullYear();
    //
    //     licenseDate = `${sdm}.${sdy} - ${edm}.${edy}`;
    // }

    return (<div className={bem.elem('clubs').cls()}>
      <div className={bem.elem('club').cls()}>
        <img
          src={club.photo && images[club.photo].downloadURL}
          alt={club.shortNameUA}
          className={bem.elem('club-logo').cls()}/>
        <div className={bem.elem('club-date').cls()}>
          {club.shortNameUA}
        </div>
        {/*
            TODO: link to transfers
                {licenseDate}
            </div>
        */}
      </div>
    </div>);
  }

  renderRow(label, info) {
    const { bem } = this.props;

    return (
      <div className={bem.elem('info').cls()}>
        <div className={bem.elem('info-text').mods('label').cls()}>
          {label}
        </div>
        <div className={bem.elem('info-text').mods('main').cls()}>
          {info}
        </div>
      </div>
    );
  }
}

const populates = [
  { child: 'photo', root: 'images' },
  { child: 'club', root: 'clubs', keyProp: 'key' },
];

function mapStateToProps(state, props) {
  const { user, locale, firebase, firebase: { data: { images } } } = state;
  const popPlayers = populate(firebase, 'players', populates);

  return {
    user,
    locale,
    images,
    playerData: popPlayers && popPlayers[props.params.id],
  };
}

export default compose(
  firebaseConnect(['images', { path: 'players', populates }]),
  connect(mapStateToProps)
)(Player);
