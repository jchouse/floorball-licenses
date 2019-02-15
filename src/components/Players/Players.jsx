import React from 'react';
import BEM from '../BEM/BEM';
import PlayersList from './List/List.jsx';
import './Players.css';

/**
 * Players page
 */
const Players = () => {
    const bem = new BEM('players');

    return (
        <div className={bem.cls()}>
            <PlayersList/>
        </div>
    );
};

export default Players;
