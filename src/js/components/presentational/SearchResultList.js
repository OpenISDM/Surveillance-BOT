/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchResultList.js

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

import React, { Fragment } from 'react';
import _ from 'lodash';
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect';
import TabletSearchResultList from '../platform/tablet/TabletSearchResultList';
import MobileSearchResultList from '../platform/mobile/MobileSearchResultList';
import BrowserSearchResultList from '../platform/browser/BrowserSearchResultList';


class SearchResultList extends React.Component {

    static contextType = AppContext

    state = {
        selectedObjectData: [],
        showNotFoundResult: false,
        showPatientResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
        showDownloadPdfRequest: false,
        showPath: false,
        signatureName:'',
        showPatientView: false,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!(_.isEqual(prevProps.searchKey, this.props.searchKey))) {
            this.setState({
                showNotFoundResult: false
            })
        } 
    }

    handleToggleNotFound = (e) => {
        e.preventDefault()
        this.setState({ 
            showNotFoundResult: !this.state.showNotFoundResult 
        })
    }


    render() {
        const { locale } = this.context;
        const { 
            searchKey,
            highlightSearchPanel
        } = this.props;

        const {
            handleToggleNotFound,
            onSelect
        } = this
        
        const {
            selection,
            showNotFoundResult
        } = this.state

        let foundResult = this.props.searchResult.filter(item => item.found)
        let notFoundResult = this.props.searchResult.filter(item => !item.found)
        let searchResult = this.state.showNotFoundResult 
            ? notFoundResult
            : foundResult

        let title = this.state.showNotFoundResult 
            ? locale.texts.SEARCH_RESULTS_NOT_FOUND
            : locale.texts.SEARCH_RESULTS_FOUND

        let propsGroup = {
            searchResult,
            title,

            /** function */
            handleToggleNotFound,
            onSelect,
            highlightSearchPanel,
            /** state */
            selection,
            showNotFoundResult
        }
        return(
            <Fragment>
                <BrowserView>
                    <BrowserSearchResultList
                        {...propsGroup}
                    />
                </BrowserView>
                <TabletView>
                    <TabletSearchResultList 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileSearchResultList
                        {...propsGroup}
                    />
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default SearchResultList
