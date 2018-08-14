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
            </Cell>
            {role ? this.renderUser() : this.renderGuest()}
        </Grid>;
    }

    renderGuest() {
        return <Cell>
            <Grid>
                <Cell size={12}>
                    <FormattedMessage id='Account.guest'/>
                </Cell>
            </Grid>
        </Cell>;
    }

    renderUser() {
        const { user: { email, displayName } } = this.props;

        return <Cell>
            <Grid key='displayName'>
                <Cell size={12}>
                    <FormattedMessage
                        id='Account.displayName'
                        values={{ displayName }}/>
                </Cell>
            </Grid>
            <Grid key='email'>
                <Cell size={12}>
                    <FormattedMessage
                        id='Account.email'
                        values={{ email }}/>
                </Cell>
            </Grid>
            <Grid key='role'>
                <Cell size={12}>
                    <FormattedMessage id='Account.role'/>
                    {this.renderRole()}
                </Cell>
            </Grid>
        </Cell>;
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