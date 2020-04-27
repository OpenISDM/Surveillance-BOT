
import React from 'react';
import Select from 'react-select';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios'
import dataSrc from "../../../dataSrc"
  
class LBeaconPicker extends React.Component {

    static contextType = AppContext

    state = {
        beacons: [],
    }
    componentDidMount = () => {
        this.getBeacon()        
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.area != this.props.area){
            this.getBeacon()
        }
        
    }

    getBeacon = () => {
        if(this.props.area){
            let { locale } = this.context
            axios.post(dataSrc.getLbeaconTable, {
                locale: locale.abbr
            }).then(res => {
                let beacons = res.data.rows.filter(beacon => {
                    return parseInt(beacon.uuid.slice(0, 4)) == parseInt(this.props.area)
                })
                this.setState({
                    beacons
                })
            })
        }
    }

    onChange = (option) => {
        this.props.getValue(option.value, this.props.id, this.props.beacon_id)
    }



    render() {

        let options = this.state.beacons.map(item => {
            return {
                value: item,
                label: item.uuid
            }
        })
        let defaultValue = {
            value: this.props.value,
            label: this.props.value
        }

        let { locale } = this.context
        return (
            <Select
                name="beaconPicker"
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

export default LBeaconPicker;