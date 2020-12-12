import React, { Component } from 'react';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { DatePicker, Button, TextField, Grid, Cell, SelectField } from 'react-md';
import BEM from '../../BEM/BEM';
import './SeasonSettings.css';

class SeasonSettings extends Component {
    static defaultProps = {
        bem: new BEM('season-settings')
    }

    render() {
        const { bem } = this.props;

        return (
            <div className={bem.cls()}>
                <h2 className={bem.elem('item-header').cls('md-headline')}>Seasons</h2>
                <form if='add-new-season'>
                    <Grid>
                        <Cell size={1} align='bottom'>
                            <h3 className='md-title'>
                                Add new
                            </h3>
                        </Cell>
                        <Cell size={2} align='bottom'>
                            <TextField
                                id='add-new-season-title'
                                label='Name'
                                lineDirection='center'
                                placeholder='Сезон 20/21'/>
                        </Cell>
                        <Cell size={1} align='bottom'>
                            <DatePicker
                                id='add-new-season-starts-date'
                                label='Starts'
                                inline
                                fullWidth={false}/>
                        </Cell>
                        <Cell size={1} align='bottom'>
                            <DatePicker
                                id='add-new-season-ends-date'
                                label='Ends'
                                inline
                                fullWidth={false}/>
                        </Cell>
                        <Cell size={1} align='bottom'>
                            <Button
                                flat
                                primary
                                swapTheming>
                                Add
                            </Button>
                        </Cell>
                    </Grid>
                </form>
                <form if='set-active-season'>
                    <Grid>
                        <Cell size={1} align='bottom'>
                            <h3 className='md-title'>
                                Set active
                            </h3>
                        </Cell>
                        <Cell size={2} align='bottom'>
                        <SelectField
                            id='select-field-default-value'
                            label='Default Valued'
                            // defaultValue={states[3].abbreviation}
                            // menuItems={states}
                            itemLabel='name'
                            itemValue='abbreviation'/>
                        </Cell>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default compose(
    firebaseConnect(['clubs'])
)(SeasonSettings);