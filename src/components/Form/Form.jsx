import React from 'react';

import { TextField, DatePicker, SelectField, Button } from 'react-md';
import BEM from '../BEM/BEM';
import Countries from '../Countries/Countries.jsx';

/**
 * Form
 *
 * NOTE: DO NOT USE identical keys inside one form
 */
class Form extends React.Component {
    static defaultProps = {
        bem: new BEM('form')
    };

    requiredElems = {}

    state = {
        errors: {},
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
                                    const { name } = component.fieldset;

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

        if (!this.isValid()) {
            return;
        }

        if (this.props.submit) {
            this.props.submit(this.state.formData);
        }
    };

    isValid() {
        const { requiredElems } = this,
            { formData } = this.state,
            errors = {};
        let isValid = true;

        Object.keys(requiredElems).forEach(key => {
            const value = formData[key];

            if (!value) {
                errors[key] = true;
                isValid = false;
            }
        });

        this.setState({ errors });

        return isValid;
    }

    renderComponents(component, index, value, group) {
        const { type, ...options } = component,
            { errors } = this.state,
            { locale } = this.props;
        let elem;

        if (type === 'select') {
            elem = <SelectField
                className='md-full-width'
                key={index}
                ref={el => options.required && this.createRef(el, options.id, group)}
                {...options}
                value={value}
                error={errors[options.id]}
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
                ref={el => options.required && this.createRef(el, options.id, group)}
                {...optionsData}
                value={dateValue}
                firstDayOfWeek={1}
                error={errors[options.id]}
                onChange={this.changeData(optionsData.id, group, type)}/>;
        } else if (type === 'countries') {
            elem = <Countries
                key={index}
                ref={el => options.required && this.createRef(el, options.id, group)}
                {...options}
                defaultValue={value}
                error={errors[options.id]}
                locale={locale}
                onSelect={this.changeData(options.id, group)}/>;
        } else {
            elem = <TextField
                key={index}
                ref={el => options.required && this.createRef(el, options.id, group)}
                {...options}
                value={value}
                error={errors[options.id]}
                onChange={this.changeData(options.id, group)}/>;
        }

        return elem;
    }

    createRef = (el, id) => {
        if (el) {
            this.requiredElems[id] = el;
        }
    };

    changeData = (id, group, type) => (dataValue, dataObject) => {
        const { formData } = this.state;
        let value = dataValue;

        if (type === 'date') {
            value = dataObject.valueOf();
        }

        if (!group) {
            formData[id] = value;
        } else {
            formData[group][id] = value;
        }

        this.setState({ formData });
    }
}

export default Form;
