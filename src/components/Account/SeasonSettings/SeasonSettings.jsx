import React from 'react';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { DatePicker, Button, TextField, Grid, Cell, SelectField } from 'react-md';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import BEM from '../../BEM/BEM';
import './SeasonSettings.css';

const SeasonSettings = props => {
    const defaultSeason = 'new';

    let seasonSelectItems = [{ label: 'Add New', value: defaultSeason }],
        selectedSeason = defaultSeason;

    const { seasons } = props,
        { control, handleSubmit, errors, setValue } = useForm(),
        bem = new BEM('season-settings'),
        onSubmit = data => {
            const { firebase: { push, update } } = props;

            if (selectedSeason === defaultSeason) {
                push('seasons', data)
                    .then(data => {
                        console.log('then', data);
                    });
            } else {
                update('seasons', {
                    [`${selectedSeason}`]: data
                });
            }
        },
        handleSelect = value => {
            const season = seasons[value];

            if (season) {
                setValue('title', season.title);
                setValue('start_date', season.start_date);
                setValue('end_date', season.end_date);
            }

            selectedSeason = value;
        };

    if (isLoaded(seasons) && seasons) {
        seasonSelectItems = [
            ...seasonSelectItems,
            ...Object.entries(seasons).map(([key, value]) => ({ label: value.title, value: key }))
        ];
    }

    return (
        <div className={bem.cls()}>
            <h2 className={bem.elem('item-header').cls('md-headline')}>Seasons</h2>
            <Grid className={bem.elem('grid').cls()}>
                <Cell size={1} align='bottom'>
                    <h3 className='md-title'>
                        Active
                    </h3>
                </Cell>
                <Cell size={1} align='bottom'>
                    <SelectField
                        id='select-field-default-value'
                        name='select'
                        label='Season'
                        defaultValue={defaultSeason}
                        menuItems={seasonSelectItems}
                        onChange={handleSelect}/>
                </Cell>
            </Grid>
            <form if='add-new-season' onSubmit={handleSubmit(onSubmit)}>
                <Grid>
                    <Cell size={1} align='bottom'>
                        <h3 className='md-title'>
                            Add new
                        </h3>
                    </Cell>
                    <Cell size={2} align='bottom'>
                        <Controller
                            name='title'
                            control={control}
                            rules={{ required: true }}
                            defaultValue=''
                            render={({ onChange, value }) => (
                                <TextField
                                    id='add-new-season-name'
                                    lineDirection='center'
                                    placeholder='Сезон 20/21'
                                    value={value}
                                    error={!!errors.title}
                                    errorText='Requered'
                                    onChange={onChange}/>)}/>
                    </Cell>
                    <Cell size={1} align='bottom'>
                        <Controller
                            name='start_date'
                            control={control}
                            rules={{ required: true }}
                            defaultValue=''
                            render={({ onChange, value }) => (
                                <DatePicker
                                    id='add-new-season-starts-date'
                                    label='Starts'
                                    inline
                                    onChange={onChange}
                                    value={value}
                                    error={!!errors.start_date}
                                    errorText='Requered'
                                    fullWidth={false}/>
                            )}/>
                    </Cell>
                    <Cell size={1} align='bottom'>
                        <Controller
                            name='end_date'
                            control={control}
                            rules={{ required: true }}
                            defaultValue=''
                            render={({ onChange, value }) => (
                                <DatePicker
                                    id='add-new-season-ends-date'
                                    label='Ends'
                                    inline
                                    onChange={onChange}
                                    value={value}
                                    error={!!errors.end_date}
                                    errorText='Requered'
                                    fullWidth={false}/>
                            )}/>
                    </Cell>
                    <Cell size={1} align='middle'>
                        <Button
                            type='submit'
                            flat
                            primary
                            swapTheming>
                            Save
                        </Button>
                    </Cell>
                </Grid>
            </form>
        </div>
    );
};


// eslint-disable-next-line one-var
const enhance = compose(
    firebaseConnect(['seasons']),
    connect(({ firebase: { data: { seasons } } }) => ({
        seasons
    }))
);

export default enhance(SeasonSettings);