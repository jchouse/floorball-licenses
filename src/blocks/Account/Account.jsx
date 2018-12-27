import React, { Component } from 'react';
import { Cell, Grid } from 'react-md';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import BEM from '../../components/BEM/BEM';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

class Account extends Component {
    static defaultProps = {
        bem: new BEM('account'),
        playersList: {}
    };

    render() {
        const { bem, user: { role } } = this.props;

        return <Grid>
            <Cell size={12}>
                <h4 className={bem.elem('account-header').cls('md-title')}>
                    <FormattedMessage id='Account.title'/>
                </h4>
                <article>
                    {role ? this.renderUser() : this.renderGuest()}
                </article>
            </Cell>
        </Grid>;
    }

    renderGuest() {
        return <p>
            <FormattedMessage id='Account.guest'/>
        </p>;
    }

    renderUser() {
        const { user: { email, displayName } } = this.props;

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
                <b> {this.renderRole()}</b>
            </p>
        ];
    }

    renderRole() {
        const { user: { role, clubId }, clubs, locale } = this.props;
        let roleId = {
            id: 'Account.base'
        };

        if (role > 20 && role < 31) {
            let clubName = '';

            if (isLoaded(clubs) && clubId) {
                const { shortNameEN, shortNameUA } = clubs[clubId];

                clubName = locale === 'en' ? shortNameEN : shortNameUA;
            }

            roleId = {
                id: 'Account.clubAdmin',
                values: { clubName }
            };
        } else if (role > 30 && role < 90) {
            roleId = {
                id: 'Account.financeAdmin'
            };
        } else if (role > 90) {
            roleId = {
                id: 'Account.mainAdmin'
            };
        }

        return <FormattedMessage {...roleId}/>;
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