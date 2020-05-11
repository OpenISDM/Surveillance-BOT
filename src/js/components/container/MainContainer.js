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
        locale: this.context.locale.abbr
    }

    errorToast = null

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
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




