import React from 'react';
import BEM from '../../components/BEM/BEM';
import ClubsList from './List/List.jsx';
import './Clubs.css';

/**
 * Clubs page
 */
const Clubs = () => {
    const bem = new BEM('clubs');

    return (
        <div className={bem.cls()}>
            <ClubsList/>
        </div>
    );
};

export default Clubs;
