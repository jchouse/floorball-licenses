import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cell, Grid, TabsContainer, Tabs, Tab } from 'react-md';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import BEM from '../BEM/BEM';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import AccountRole from './AccountRole/AccountRole.jsx';
import SeasonSettings from './SeasonSettings/SeasonSettings.jsx';
import LicensesSettings from './LincensesSettings/LicensesSettings.jsx';

class Account extends Component {
    static defaultProps = {
        bem: new BEM('account'),
        playersList: {}
    };

    static propTypes = {
        user: PropTypes.object,
        clubs: PropTypes.object,
        locale: PropTypes.string
    };

    render() {
        const { user: { role } } = this.props,
            tabsList = [];

        tabsList.push(
            <Tab key='title' label={<FormattedMessage id='Account.title'/>}>
                <Grid>
                    <Cell size={12}>
                        {role ? this.renderUser() : this.renderGuest()}
                    </Cell>
                </Grid>
            </Tab>
        );

        if (role > 90) {
            tabsList.push(
                <Tab key='roles' label={<FormattedMessage id='Account.portalSettings'/>}>
                    <Grid>
                        <Cell size={12}>
                            <SeasonSettings/>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell size={12}>
                            <LicensesSettings/>
                        </Cell>
                    </Grid>
                </Tab>
            );
        }

        return (
            <TabsContainer colored>
                <Tabs tabId='account'>
                    {tabsList}
                </Tabs>
            </TabsContainer>
        );
    }

    renderGuest() {
        return (
            <p>
                <FormattedMessage id='Account.guest'/>
            </p>
        );
    }

    renderUser() {
        const { user, clubs, locale, user: { email, displayName } } = this.props;

        return [
            <p key='displayName'>
                <FormattedMessage
                    id='Account.displayName'/>
                <b> {displayName}</b>
            </p>,
            <p key='email'>
                <FormattedMessage
                    id='Account.email'/>
                <b> {email}</b>
            </p>,
            <p key='role'>
                <FormattedMessage id='Account.role'/>
                <b> {isLoaded(user) && isLoaded(clubs) && AccountRole.getRole(user, clubs, locale)}</b>
            </p>
        ];
    }
}

function mapStateToProps(state) {
    const { user, locale, firebase: { data: { clubs } } } = state;

    return {
        user,
        clubs,
        locale
    };
}

export default compose(
    firebaseConnect(['clubs']),
    connect(mapStateToProps)
)(Account);
