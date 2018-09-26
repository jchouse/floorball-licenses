import React from 'react';

import { TextField, DatePicker, SelectField, Button } from 'react-md';
import BEM from '../BEM/BEM';

/**
 * Form
 */
class Form extends React.Component {
    static defaultProps = {
        bem: new BEM('form')
    };

    state = {
        formData: this.props.data
    };

    componentWillReceiveProps({ data }) {
        if (data) {
            this.setState({
                formData: data
            });
        }
    }

    render() {
        const { bem, schema } = this.props,
            { formData } = this.state;

        return <form className={bem.cls()}>
            {schema.map((component, index) => {
                let lines;

                if (!component.fieldset) {
                    lines = this.renderComponents(component, index, formData[component.id]);
                } else {
                    lines = (
                        <div key={index} className={bem.elem('fieldset').cls()}>
                            <div key={index} className={bem.elem('fieldset-header').cls()}>
                                {component.fieldset.title}
                            </div>
                            {component.fieldset.fields
                                .map((field, i) => {
                                    const {name} = component.fieldset;

                                    return this
                                        .renderComponents(field, i, formData[name][field.id], name);
                                })}
                        </div>
                    );
                }

                return lines;
            })}
            <Button flat primary swapTheming onClick={this.submit}>save</Button>
        </form>;
    }

    submit = e => {
        e.preventDefault();

        if (this.props.submit) {
            this.props.submit(this.state.formData);
        }
    };

    renderComponents(component, index, value, group) {
        const { type, ...options } = component;
        let elem;

        if (type === 'select') {
            elem = <SelectField
                className='md-full-width'
                key={index}
                {...options}
                value={value}
                onChange={this.changeData(options.id, group)}/>;
        } else if (type === 'date') {
            const { ...optionsData } = options;
            let dateValue;

            if (value) {
                dateValue = typeof value === 'number' ? new Date(value) : value;
            } else {
                dateValue = new Date();
            }

            elem = <DatePicker
                key={index}
                {...optionsData}
                value={dateValue}
                firstDayOfWeek={1}
                onChange={this.changeData(optionsData.id, group, type)}/>;
        } else {
            elem = <TextField
                key={index}
                {...options}
                value={value}
                onChange={this.changeData(options.id, group)}/>;
        }

        return elem;
    }

    changeData = (id, group, type) => (dataValue, dataObject) => {
        const { formData } = this.state;
        let value = dataValue;

        if (type === 'date') {
            value = dataObject.valueOf();
        }

        console.log('formData', formData);
        console.log(id, group, type);

        if (!group) {
            formData[id] = value;
        } else {
            formData[group][id] = value;
        }

        this.setState({ formData });
    }
}

export default Form;
