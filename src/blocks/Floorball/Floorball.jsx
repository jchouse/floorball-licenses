import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import intlData from '../../intl/Intl';

import Header from '../Header/Header.jsx';

class Floorball extends Component {
    render() {
        const { locale } = this.props;

        return (
            <IntlProvider locale={locale} messages={intlData[locale]}>
                <div>
                    <Header/>
                    {this.props.children}
                </div>
            </IntlProvider>
        );
    }
}

function mapStateToProps(state) {
    const { locale } = state;

    return { locale };
}

export default connect(mapStateToProps)(Floorball);
