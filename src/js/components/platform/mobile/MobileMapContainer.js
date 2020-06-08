/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MobileMapContainer.js

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


import React from 'react'
import QRcodeContainer from '../../container/QRcode'
import { 
    AppContext
} from '../../../context/AppContext';
import InfoPrompt from '../../presentational/InfoPrompt'
import config from '../../../config'
import {
    Nav,
    Button 
} from 'react-bootstrap'
import AccessControl from '../../presentational/AccessControl'
import Map from '../../presentational/Map'

export default class TabletMapContainer extends React.Component {

    static contextType = AppContext

    render() {

        const { 
            locale,
            stateReducer,
            auth
        } = this.context;

        const { 
            hasSearchKey,
            geofenceConfig,
            locationMonitorConfig,
            searchedObjectType,
            proccessedTrackingData,
            showedObjects,
            showPdfDownloadForm,
            handleClickButton,
            pathMacAddress,
        } = this.props;

        let [{areaId}] = stateReducer

        const style = {
            title: {
                color: "grey",
                fontSize: "1rem",
                maxWidth: "9rem",
                height: "5rem",
                lineHeight: "3rem"
            },
            mapForMobile: {
                // width: '90vw',
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            mapBlock: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            MapAndQrcode: {
                height: '42vh'
            },
            qrBlock: {
                width: '10vw',
            },
            mapBlockForTablet: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
                width: '60vw'
            },
            button: {
                fontSize: "0.8rem"
            }
        }

        return (
            <div style={style.mapForMobile}>
                <Map
                    pathMacAddress={pathMacAddress}
                    hasSearchKey={hasSearchKey}
                    proccessedTrackingData={proccessedTrackingData}
                    lbeaconPosition={this.props.lbeaconPosition}
                    geofenceConfig={this.props.geofenceConfig}
                    getSearchKey={this.props.getSearchKey}
                    areaId={areaId}
                    searchedObjectType={this.props.showedObjects}
                    mapConfig={config.mapConfig}
                    handleClosePath={this.props.handleClosePath}
                    handleShowPath={this.props.handleShowPath}
                    showPath={this.props.showPath}
                    style={{border:'solid'}}
                />
            </div>
        )
    }
}