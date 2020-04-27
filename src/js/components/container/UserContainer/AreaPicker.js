
import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios'
import config from "../../../config"
  
class AreaPicker extends React.Component {

    static contextType = AppContext

    state = {
        selectedArea: "0",
        length: 24,
        areaList: {}
    }
    componentDidMount = () => {
        this.getArea()
    }

    getArea = () => {
        this.setState({
            areaList: config.mapConfig.areaOptions
        })
    }

    onChange = (value) => {
        let id = this.props.id
        this.props.getValue(value, id)
        this.setState({
            time: value
        })
    }

    render() {
        let { locale } = this.context
        let options = []
        for(var i in this.state.areaList){
            options.push({
                value: i,
                label: locale.texts[this.state.areaList[i]]
            })}

        const defaultValue = {
            value: this.props.area_id,
            label: this.state.areaList[parseInt(this.props.area_id)]
        }
        return (
            <Select
                name="areaPicker"
                value={defaultValue}
                onChange={value => this.onChange(value)}
                options={options}
                isSearchable={false}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        )
    }
}

export default AreaPicker;