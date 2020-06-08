/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        FrequentSearch.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import React  from 'react';
import { 
    Button 
} from 'react-bootstrap';
import AccessControl from '../presentational/AccessControl';
import { AppContext } from '../../context/AppContext';

class FrequentSearch extends React.Component {

    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasGridButton !== this.props.hasGridButton && this.props.hasGridButton) {
            this.setState({
                searchKey: ''
            })
        }
    }

    handleClick = (e) => {
        const itemName = e.target.name
        this.getSearchKey(itemName)
    }

    getSearchKey = (itemName) => {
        this.props.getSearchKey(itemName)
        this.setState({
            searchKey: itemName
        })
    }

    render() {
        const { 
            locale, 
            auth 
        } = this.context

        const style = {
            list: {
                maxHeight: this.props.maxHeigh,
                overflow: "hidden scroll"
            }
        }

        return (
            <div id='frequentSearch' >
                <div className='text-capitalize title'>{locale.texts.FREQUENT_SEARCH}</div>
                <div style={style.list} className="d-inline-flex flex-column searchOption">
                    {auth.authenticated && auth.user.searchHistory &&
                        auth.user.searchHistory.filter( (item,index) => {
                            return index < auth.user.freqSearchCount
                    }).map( (item, index) => {
                        return (
                            <Button
                                variant="outline-custom"
                                className="text-none"
                                onClick={this.handleClick} 
                                // active={this.state.searchKey === item.name.toLowerCase()} 
                                key={index}
                                name={item.name}
                            >
                                {item.name}
                            </Button>
                        )
                    })}
                    <hr/>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        // active={this.state.searchKey === 'all devices'}
                        name='all devices'
                    >
                        {locale.texts.ALL_DEVICES}
                    </Button>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick}
                        className="text-capitalize" 
                        // active={this.state.searchKey === 'all devices'}
                        name='all patients'
                    >
                        {locale.texts.ALL_PATIENTS}
                    </Button>
                    <AccessControl
                        permission={'user:mydevice'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            className="text-capitalize"
                            // active={this.state.searchKey === 'my devices'}
                            name='my devices'
                        >
                            {locale.texts.MY_DEVICES}
                        </Button>
                    </AccessControl>
                    <AccessControl
                        permission={'user:mypatient'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick}
                            className="text-capitalize"
                            name = 'my patients'
                        >
                            {locale.texts.MY_PATIENTS}
                        </Button>
                    </AccessControl>
                </div>
            </div>
        )
    }
}

export default FrequentSearch;

