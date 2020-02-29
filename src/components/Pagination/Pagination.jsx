import React from 'react';
import BEM from '../BEM/BEM';
import { Button } from 'react-md';
import { FormattedMessage } from 'react-intl';
import './Pagination.css';

const bem = new BEM('pagination');

const Pagination = ({offset, size, changePage}) => {
    return <div className={bem.cls()}>
        <Button
            icon
            primary
            disabled={offset === 0}
            onClick={() => changePage(null, -1)}>chevron_left</Button>
        <div className={bem.elem('text').cls()}>
            <FormattedMessage id='Pagination.pages' values={{page: ++offset, count: size}}/>
        </div>
        <Button
            icon
            primary
            disabled={offset === size}
            onClick={() => changePage(null, 1)}>chevron_right</Button>
    </div>;
};

export default Pagination
