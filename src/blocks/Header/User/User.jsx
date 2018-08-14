import React from 'react';
import PropTypes from 'prop-types';
import BEM from '../../../components/BEM/BEM';
import { ListItem } from 'react-md';
import './User.css';
import { pages } from '../../../components/location/location';
import { Link } from 'react-router';

const User = ({ user }) => {
    const { email, displayName = 'Guest' } = user;

    return (
        <ListItem
            component={Link}
            active={true}
            to={pages.YOUR_ACCOUNT}
            primaryText={displayName}
            secondaryText={email}/>);
};

User.propTypes = {
    user: PropTypes.object.isRequired
};

User.defaultProps = {
    bem: new BEM('user')
};

export default User;
