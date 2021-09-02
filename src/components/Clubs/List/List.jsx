import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { firebaseConnect, populate, isLoaded } from 'react-redux-firebase';
import { Grid, GridCell, MediaContainer, MediaOverlay, CardTitle, Button } from 'react-md';
import BEM from '../../BEM/BEM';
import './List.css';

/**
 * Clubs list
 */
class ClubsList extends Component {
  static defaultProps = {
    bem: new BEM('clubs-list'),
  };

  render() {
    const { bem, clubsList } = this.props;

    return (
      <Grid className={bem.cls()}>
        {isLoaded(clubsList) && Object.entries(clubsList).map(([clubId, club]) => this.renderCard(clubId, club))}
      </Grid>
    );
  }

  renderCard(clibId, club) {
    const { bem, locale } = this.props;
    const clubName = locale === 'en' ? 'shortNameEN' : 'shortNameUA';

    return (
      <GridCell size={3} key={clibId}>
        <MediaContainer aspectRatio='4-3' className={bem.elem('card').cls()}>
          <img className={bem.elem('card-image').cls()} src={club.photo && club.photo.downloadURL} alt={club[clubName]}/>
          <MediaOverlay>
            <CardTitle title={club[clubName]} subtitle={club.address.city}>
              <Link to={`/clubs/${clibId}`} className='md-cell--right'>
                <Button icon>open_in_browser</Button>
              </Link>
            </CardTitle>
          </MediaOverlay>
        </MediaContainer>
      </GridCell>
    );
  }
}

const populates = [
  { child: 'photo', root: 'images' },
];

function mapStateToProps(state) {
  const { locale, firebase } = state;

  return {
    clubsList: populate(firebase, 'clubs', populates),
    locale,
  };
}

export default compose(
  firebaseConnect([{
    path: 'clubs', populates,
  }]),
  connect(mapStateToProps)
)(ClubsList);
