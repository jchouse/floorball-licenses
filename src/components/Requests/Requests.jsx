import React, { Component } from 'react';
import { Cell, Grid, Button } from 'react-md';
import { FormattedMessage } from 'react-intl';
import BEM from '../BEM/BEM';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { withRouter } from 'react-router';

class Requests extends Component {
  static defaultProps = {
    bem: new BEM('license-continue'),
  };

  state = {
    created: [],
  };

  render() {
    const { bem, requests } = this.props;

    return [
      <Grid key='header'>
        <Cell size={12}>
          <h2 className={bem.elem('header').cls('md-title')}>
            <FormattedMessage id='Requests.mainHeader'/>
          </h2>
          {isLoaded(requests) && this.renderControls()}
        </Cell>
      </Grid>,
      isLoaded(requests) && <Grid key='new-request-list'>
        <Cell size={12}>
          {this.renderNewRequestList()}
        </Cell>
      </Grid>,
      isLoaded(requests) && <Grid key='closed-request-list'>
        <Cell size={12}>
          {this.renderClosedRequestList()}
        </Cell>
      </Grid>,
    ];
  }

  renderControls() {
    return [
      <Button
        key='new'
        flat
        primary
        onClick={this.newRequest}>
        <FormattedMessage id='Requests.newRequest'/>
      </Button>,
    ];
  }

  newRequest = e => {
    e.preventDefault();
    const { router } = this.props;

    router.push('/requests/new');
  };

  renderNewRequestList() {
    const { bem, inProgressRequests } = this.props;

    return <div>
      <h4 className={bem.elem('list-header').cls('md-title')}>
        Запити в роботі
      </h4>
      {inProgressRequests.length > 0
        ? <ul className={bem.elem('list').cls()}>
          {inProgressRequests.map(request => this.requestInfo(request))}
        </ul>
        : 'Немає запитів на розглядані'}
    </div>;
  }

  renderClosedRequestList() {
    const { bem, closedRequests, inProgressRequests } = this.props;

    return <div>
      <h4 className={bem.elem('list-header').cls('md-title')}>
        Виконані запити
      </h4>
      {closedRequests.length > 0
        ? <ul className={bem.elem('list').cls()}>
          {inProgressRequests.map(request => this.requestInfo(request))}
        </ul>
        : 'Немає виконаних запитів'}
    </div>;
  }

  requestInfo() {

  }

  renderNewItem() {
    const { bem } = this.props;

    return <div className={bem.elem('request').mods('new').cls()}/>;
  }
}

function mapStateToProps(state) {
  const { user, locale, firebase: { data: { requests } } } = state,
    clubsPlayers = [],
    inProgressRequests = [],
    closedRequests = [];

  // if (requests && user && user.clubId) {

  // }

  return {
    locale,
    user,
    requests,
    clubsPlayers,
    inProgressRequests,
    closedRequests,
  };
}

export default compose(
  firebaseConnect(['players', 'requests']),
  connect(mapStateToProps),
  withRouter
)(Requests);