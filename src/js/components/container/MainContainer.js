/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MainContainer.js

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
import { toast } from 'react-toastify';
import {
    BrowserView,
    MobileOnlyView,
    TabletView
} from 'react-device-detect';
import { disableBodyScroll } from 'body-scroll-lock';
import retrieveDataHelper from '../../helper/retrieveDataHelper';
import messageGenerator from '../../helper/messageGenerator';
import TabletMainContainer from '../platform/tablet/TabletMainContainer';
import MobileMainContainer from '../platform/mobile/MobileMainContainer';
import BrowserMainContainer from '../platform/browser/BrowserMainContainer';
import SiteModuleTW from '../../../../site_module/locale/zh-TW';
import SiteModuleEN from '../../../../site_module/locale/en-US';

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        hasSearchKey: false,
        searchKey: '',
        lastsearchKey: '',
        searchResult: [],
        clearSearchResult: false,
        authenticated: this.context.auth.authenticated,
        display: true,
        locale: this.context.locale.abbr,
        suggestData:[]
    }

    errorToast = null

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement); 
        this.getSuggestData();
    }

    componentDidUpdate = (prevProps, prevState) => {

        /** clear out search result when user sign out */
        if (!(_.isEqual(prevState.authenticated, this.context.auth.authenticated))) {
            this.setState({
                authenticated: this.context.auth.authenticated,
                searchResult: [],
                searchKey: '',
                hasSearchKey: false,
            }) 
        } 
        if (this.context.locale.abbr !== prevState.locale) {   
            this.getSearchKey(this.state.searchKey);
        }

    } 

    async  getSuggestData()  {
        let { 
            auth, 
            locale,  
        } = this.context

        let obj_asn = [],obj_name =[],area_name=[],lbeacon_description =[]

        await  retrieveDataHelper.getObjectTable(
            locale.lang || null, 
            auth.user.areas_id, 
            [1, 2]
        ).then(res => {  
            res.data.rows.map(item=>{
                obj_asn.push(item.asset_control_number)
                obj_name.push(item.name)
            }) 
        })
        .catch(function (error) { 
            console.log(error);
        })

        await  retrieveDataHelper.getAreaTable()
         .then(res2 => {  
            res2.data.rows.map(item=>{ 
            this.context.locale.lang == 'en' 
            ? area_name.push(SiteModuleEN[item.name])  
            : area_name.push(SiteModuleTW[item.name])  
            }) 
        })
        .catch(function (error) { 
            console.log(error);
        })

        await retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
        .then(res3 => { 
            res3.data.rows.map(item=>{
                lbeacon_description.push(item.description) 
            })

        let suggestDataTotal =[],suggestData = [] 
        suggestDataTotal.push(obj_asn)
        suggestDataTotal.push(obj_name)
        suggestDataTotal.push(area_name)
        suggestDataTotal.push(lbeacon_description) 
        suggestDataTotal.map(item=>{
            item.map(data=>{  
               suggestData.push(data)   
            }) 
        })    
        this.setState({
            suggestData : suggestData 
        })   
        }).catch(function (error) { 
            console.log(error);
        })    
       
    }
 
    /** Get tracking data from database.
     *  Once get the tracking data, violated objects would be collected. */ 
    getTrackingData = (callback) => {
        
        let { 
            auth, 
            locale, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
        .then(res => {

            /** dismiss error message when the database is connected */
            if (this.errorToast) {
                this.errorToast = null;
                toast.dismiss(this.errorToast)
            }

            var trackingData;
            if (res.data == 'permission denied') trackingData = []
            else trackingData = res.data.map(item => {
                item.location_area = locale.texts[item.lbeacon_area.value]
                return item
            })
            this.setState({
                trackingData,
            }, callback)  
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`)

            /** sent error message when database is not connected */
            if (!this.errorToast) {
                this.errorToast = messageGenerator.setErrorMessage()
            }
        })
    }

    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey = searchKey => {
        this.getTrackingData(() => this.getResultBySearchKey(searchKey))
    }

    /** Process the search result by the search key.
     *  Search field includes:
     *  1. name
     *  2. asset id
     *  3. location description
     *  4. location area
     */
    getResultBySearchKey = searchKey => {
        let searchResult = [];
        let hasSearchKey = true
        let {
            trackingData
        } = this.state
        let {
            locale
        } = this.context;
        let proccessedTrackingData = _.cloneDeep(trackingData) 
        if (/^ *$/.test(searchKey)) hasSearchKey = false
        else {
            proccessedTrackingData
                .map(item => {   
                    if (
                        item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
                        item.asset_control_number.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
                        (item.location_description != null && item.location_description.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0) ||
                        (item.location_area != null && item.location_area.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0)
                    ) {
                        searchResult.push(item)
                    }
                   
                })
        }

        this.setState({
            proccessedTrackingData,
            searchResult,
            hasSearchKey,
            searchKey,
            locale: locale.abbr
        })
    }


    render(){ 
        const { 
            hasSearchKey,
            trackingData,
            proccessedTrackingData,
            searchResult,
            searchKey,
            authenticated,
            clearSearchResult,
            showPath,
            display,
            pathMacAddress,
            suggestData,
        } = this.state;

        const {
            handleClearButton,
            getSearchKey,
            setMonitor,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            setShowedObjects,
            handleShowResultListForMobile,
            mapButtonHandler,
            highlightSearchPanel
        } = this

        const propsGroup = {
            handleClearButton,
            hasSearchKey,
            getSearchKey,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            authenticated,
            clearSearchResult,
            searchKey,
            searchResult,
            trackingData,
            proccessedTrackingData,
            setShowedObjects,
            handleShowResultListForMobile,
            display,
            pathMacAddress,
            mapButtonHandler,
            suggestData
        } 
        return (
            /** "page-wrap" the default id named by react-burget-menu */
            <Fragment>
                <BrowserView>
                    <BrowserMainContainer 
                        {...propsGroup}
                    />
                </BrowserView>
                <TabletView>
                    <TabletMainContainer 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileMainContainer 
                        {...propsGroup}
                    />
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default MainContainer




