import React from 'react';
import BEM from '../BEM/BEM';
import { Button } from 'react-md';
import { FormattedMessage } from 'react-intl';
import './Pagination.css';

/**
 * Pagination
 */
export default class Pagination extends React.Component {
  static defaultProps = {
    bem: new BEM('pagination'),
  };

  state = {
    offset: this.props.offset,
    size: this.props.size,
  };

  UNSAFE_componentWillReceiveProps({ offset, size }) {
    this.setState({ offset, size });
  }

  render() {
    const { bem } = this.props;

    let { offset, size } = this.state;

    return <div className={bem.cls()}>
      <Button
        icon
        primary
        disabled={offset === 0}
        onClick={this.changePage(null, -1)}>chevron_left</Button>
      <div className={bem.elem('text').cls()}>
        <FormattedMessage id='Pagination.pages' values={{ page: ++offset, count: size }}/>
      </div>
      <Button
        icon
        primary
        disabled={offset === size}
        onClick={this.changePage(null, 1)}>chevron_right</Button>
    </div>;
  }

  changePage = (page, inc) => () => {
    this.props.changePage(page, inc);
  }
}
