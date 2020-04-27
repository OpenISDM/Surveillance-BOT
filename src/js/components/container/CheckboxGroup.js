import React from 'react'

class CheckboxGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange = event => {
        const target = event.currentTarget;
        let valueArray = [...this.props.value] || [];

        if (target.checked) {
            valueArray.push(target.id);
        } else {
            valueArray.splice(valueArray.indexOf(target.id), 1);
        }
        this.props.onChange(this.props.id, valueArray);
    };

    handleBlur = () => {
        this.props.onBlur(this.props.id, true);
    };

    render() {
        const { value, error, touched, label, className, children } = this.props;
        return (
            <div className=''>
                <fieldset>
                {React.Children.map(children, child => {
                    return React.cloneElement(child, {
                                field: {
                                    value: value.includes(child.props.id),
                                    onChange: this.handleChange,
                                }
                            });
                })}
                </fieldset>
            </div>
        );
    }
}

export default CheckboxGroup;