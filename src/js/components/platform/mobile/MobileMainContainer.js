import React from 'react';
import MapContainer from '../../container/MapContainer';
import SearchResultList from '../../presentational/SearchResultList'
import SearchContainer from '../../container/SearchContainer'
import {
    ButtonGroup,
    Button
} from 'react-bootstrap'
import AuthenticationContext from '../../../context/AuthenticationContext';
import LocaleContext from '../../../context/LocaleContext';

const MobileMainContainer = ({
    handleClearButton,
    getSearchKey,
    setMonitor,
    clearAlerts,
    handleClosePath,
    handleShowPath,
    lbeaconPosition,
    geofenceConfig,
    authenticated,
    searchedObjectType,
    showedObjects,
    highlightSearchPanel,
    showMobileMap,
    clearSearchResult,
    hasGridButton,
    searchKey,
    searchResult,
    trackingData,
    proccessedTrackingData,
    hasSearchKey,
    setShowedObjects,
    handleShowResultListForMobile,
    display,
    mapButtonHandler,
    pathMacAddress

}) => {

    let auth = React.useContext(AuthenticationContext);
    let locale = React.useContext(LocaleContext);

    const style = {

        searchPanelForMobile: {
            // zIndex: isHighlightSearchPanel ? 1060 : 1,
            display: display ? null : 'none',
            fontSize: '2rem',
            background: "white",
            borderRadius: 10,
            //border: 'solid',
            height: '90vh',
            // width:'90vw'
        },
        mapForMobile: {
            display: showMobileMap ? null : 'none'
        },

    }

    return (
        <div id="page-wrap" className='d-flex flex-column' style={{height: "90vh"}}>
            <div className='h-100' style={{overflow: 'hidden hidden'}}>
                <div id='searchPanel' className="h-100" style={style.searchPanelForMobile}>
                    <SearchContainer 
                        hasSearchKey={hasSearchKey}
                        clearSearchResult={clearSearchResult}
                        auth={auth}
                        getSearchKey={getSearchKey}
                        handleShowResultListForMobile={handleShowResultListForMobile}
                    />
                </div>
                <div style={style.mapForMobile} className="m-1">
                    <MapContainer
                        pathMacAddress={pathMacAddress} 
                        proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                        hasSearchKey={hasSearchKey}
                        searchResult={searchResult}
                        handleClearButton={handleClearButton}
                        getSearchKey={getSearchKey}
                        setMonitor={setMonitor}
                        lbeaconPosition={lbeaconPosition}
                        geofenceConfig={geofenceConfig}
                        clearAlerts={clearAlerts}
                        searchKey={searchKey}
                        handleClosePath={handleClosePath}
                        handleShowPath={handleShowPath}
                        searchedObjectType={searchedObjectType}
                        showedObjects={showedObjects}
                        handleClearButton={handleClearButton}
                        mapButtonHandler={mapButtonHandler}
                    />
                </div>
                <ButtonGroup style={{marginTop:'5px',marginBottom:'5px'}}>
                    <Button 
                        variant='outline-primary' 
                        onClick={mapButtonHandler}
                    >
                        {showMobileMap ? locale.texts.HIDE_MAP : locale.texts.SHOW_MAP}
                    </Button>
                    <Button 
                        variant='outline-primary' 
                        onClick={handleClearButton}
                    >
                        {locale.texts.NEW_SEARCH}
                    </Button>
                </ButtonGroup>
                <div className='d-flex justify-content-center'>
                    <SearchResultList
                        searchResult={searchResult} 
                        searchKey={searchKey}
                        highlightSearchPanel={highlightSearchPanel}
                        handleShowPath={handleShowPath}
                        showMobileMap={showMobileMap}
                    />
                </div>
            </div>
        </div>
    )
}

export default MobileMainContainer