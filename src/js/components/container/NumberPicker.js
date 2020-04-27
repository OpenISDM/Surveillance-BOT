
import React from 'react';
import Select from 'react-select';
import { AppContext } from '../../context/AppContext';
import styleConfig from "../../config/styleConfig"

class NumberPicker extends React.Component {

    static contextType = AppContext

    state = {
        value: {
            value: this.props.value,
            label: this.props.value
        }
    }

    onChange = (value) => {
        this.props.onChange(value.value)
        this.setState({
            value,
        })
    }

    render() {

        let {
            locale
        } = this.context

        let options = Array.from(Array(this.props.length).keys())
            .map(index => {
                return {
                    value: `${index + 1}`,
                    label: `${index + 1}`
                }
            })

        return (
            <Select
                placeholder={locale.texts.SELECT_TIME}
                value={this.state.value}
                className="ml-2"
                onChange={value => this.onChange(value)}
                options={options}
                isSearchable={false}
                styles={styleConfig.reactSelect}
                controlHeigh={20}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        )
    }
}

export default NumberPicker;