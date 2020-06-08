/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchContainer.js

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
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect';
import TabletSearchContainer from '../platform/tablet/TabletSearchContainer';
import MobileSearchContainer from '../platform/mobile/MobileSearchContainer';
import BrowserSearchContainer from '../platform/browser/BrowserSearchContainer';

const SearchContainer = ({
    searchKey,
    getSearchKey,
    clearSearchResult,
    handleShowResultListForMobile,
    suggestData
}) => {

    const propsGroup = {
        searchKey,
        getSearchKey,
        clearSearchResult,
        handleShowResultListForMobile,
        suggestData
    }
    
    return (
        <Fragment>
            <BrowserView>                   
                <BrowserSearchContainer 
                    {...propsGroup}
                />
            </BrowserView>
            <TabletView>
                <TabletSearchContainer 
                    {...propsGroup}
                />
            </TabletView>
            <MobileOnlyView>
                <MobileSearchContainer
                    {...propsGroup}
                />
            </MobileOnlyView>
        </Fragment>
    );
}


export default SearchContainer;