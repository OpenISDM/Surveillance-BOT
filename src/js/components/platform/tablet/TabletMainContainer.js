import React from 'react';
import MapContainer from '../../container/MapContainer';
import SearchResultList from '../../presentational/SearchResultList'
import SearchContainer from '../../container/SearchContainer'
import AuthenticationContext from '../../../context/AuthenticationContext';

const TabletMainContainer = ({
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
    pathMacAddress,

}) => {

    let auth = React.useContext(AuthenticationContext);
    
    const style = {
        noResultDiv: {
            color: 'grey',
            fontSize: '1rem',
        },
        titleText: {
            color: 'rgb(80, 80, 80, 0.9)',
        }, 

    }

    return (
        <div id="page-wrap" className='d-flex flex-column w-100' style={{height: "90vh"}}>
            <div id="mainContainer" className='d-flex flex-row h-100 w-100'>
                <div className='d-flex flex-column' style={style.MapAndResult}>
                    <div className="d-flex" style={style.MapAndQrcode}>
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
                            authenticated={authenticated}
                            handleClosePath={handleClosePath}
                            handleShowPath={handleShowPath}
                            searchedObjectType={searchedObjectType}
                            showedObjects={showedObjects}
                            setShowedObjects={setShowedObjects}
                        />
                    </div>

                    <div id="searchResult" className="d-flex" style={{justifyContent: 'center'}}>
                        <SearchResultList
                            searchResult={searchResult} 
                            searchKey={searchKey}
                            highlightSearchPanel={highlightSearchPanel}
                            handleShowPath={handleShowPath}
                            showMobileMap={showMobileMap}
                        />
                    </div>
                </div>
                <div id='searchPanel' className="h-100" style={style.searchPanelForTablet}>
                    <SearchContainer
                        hasSearchKey={hasSearchKey}
                        clearSearchResult={clearSearchResult}
                        hasGridButton={hasGridButton}
                        auth={auth}
                        getSearchKey={getSearchKey}
                    />
                </div>
            </div>
        </div>
    )
}

export default TabletMainContainer