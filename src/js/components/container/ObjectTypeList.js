/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectTypeList.js

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
import { Button } from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import axios from 'axios'
import { addUserSearchHistory } from '../../dataSrc'

class ObjectTypeList extends React.Component {

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
        const itemName = e.target.name;
        this.props.getSearchKey(itemName)        
        this.addSearchHistory(itemName)
        this.checkInSearchHistory(itemName)
    }

    /** Set search history to auth */
    addSearchHistory(searchKey) {
        let { auth } = this.context
        if (!auth.authenticated) return;
        const searchHistory = auth.user.searchHistory || []
        let flag = false; 
        const toReturnSearchHistory = searchHistory.map( item => {
            if (item.name === searchKey) {
                item.value = item.value + 1;
                flag = true;
            }
            return item
        })
        flag === false ? toReturnSearchHistory.push({name: searchKey, value: 1}) : null;
        const sortedSearchHistory = this.sortSearchHistory(toReturnSearchHistory)
        auth.setSearchHistory(sortedSearchHistory)
    }

    /** Sort the user search history and limit the history number */
    sortSearchHistory(history) {
        let toReturn = history.sort( (a,b) => {
            return b.value - a.value
        })
        return toReturn
    }

    /** Insert search history to database */
    checkInSearchHistory(itemName) {
        let { 
            auth 
        } = this.context

        axios.post(addUserSearchHistory, {
            username: auth.user.name,
            keyType: 'object type search',
            keyWord: itemName
        }).then(res => {
            this.setState({
                searchKey: itemName
            })
        }).catch(err => {
            console.log(`check in search history fail ${err}`)
        })
    }

    render() {
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
            list: {
                maxHeight: this.props.maxHeigh,
                overflow: "hidden scroll",
            },
        }

        const { 
            locale, 
        } = this.context

        return (
            <div>
                <div className='text-capitalize title'>
                    {locale.texts.OBJECT_TYPE}
                </div>
                <div style={style.list} className="d-inline-flex flex-column searchOption">
                    {this.props.objectTypeList
                        .map((item, index) => {
                            return ( 
                                <Button
                                    variant="outline-custom"
                                    className="text-none"
                                    onClick={this.handleClick} 
                                    // active={this.state.searchKey === item.toLowerCase()} 
                                    key={index}
                                    name={item}
                                >
                                    {item}
                                </Button>
                            )
                    })}
                </div>
            </div>
                
        )
    }
}

export default ObjectTypeList;