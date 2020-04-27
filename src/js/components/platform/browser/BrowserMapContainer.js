import React from 'react'
import { 
    AppContext
} from '../../../context/AppContext';
import config from '../../../config'
import {
    Nav,
    Button 
} from 'react-bootstrap'
import AccessControl from '../../presentational/AccessControl'
import Map from '../../presentational/Map'

export default class BrowserMapContainer extends React.Component {

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
            handleClickButton
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
            <div id="MapContainer" style={style.MapContainer} className="overflow-hidden">
                <div style={style.mapBlock}>
                    <Map
                        pathMacAddress={this.props.pathMacAddress}
                        hasSearchKey={hasSearchKey}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={proccessedTrackingData}
                        lbeaconPosition={this.props.lbeaconPosition}
                        geofenceConfig={this.props.geofenceConfig}
                        locationMonitorConfig={this.props.locationMonitorConfig}
                        getSearchKey={this.props.getSearchKey}
                        areaId={areaId}
                        searchedObjectType={this.props.showedObjects}
                        mapConfig={config.mapConfig}
                        handleClosePath={this.props.handleClosePath}
                        handleShowPath={this.props.handleShowPath}
                        showPath={this.props.showPath}
                    />
                </div>
                <div>
                    <Nav className="d-flex align-items-start text-capitalize bd-highlight">
                        <Nav.Item className="mt-2">
                            <Button 
                                variant="outline-primary" 
                                className="mr-1 ml-2 text-capitalize" 
                                onClick={handleClickButton} 
                                name="clear"
                                disabled={!this.props.hasSearchKey}
                            >
                                {locale.texts.CLEAR}
                            </Button>
                        </Nav.Item>
                        <AccessControl
                            permission={"user:saveSearchRecord"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item className="mt-2">
                                <Button 
                                    variant="outline-primary" 
                                    className="mr-1 ml-2 text-capitalize" 
                                    onClick={handleClickButton} 
                                    name="save"
                                    disabled={!this.props.hasSearchKey || this.props.showPdfDownloadForm}
                                >
                                    {locale.texts.SAVE}
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:toggleShowDevices"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item className="mt-2">
                                <Button 
                                    variant="primary" 
                                    className="mr-1 ml-2 text-capitalize" 
                                    onClick={handleClickButton} 
                                    name="searchedObjectType"
                                    value={[-1, 0]}
                                    active={(this.props.showedObjects.includes(0) || this.props.showedObjects.includes(-1)) }
                                    disabled={
                                        !(searchedObjectType.includes(-1) ||
                                        searchedObjectType.includes(0))
                                    }
                                >
                                    {!(showedObjects.includes(0) || showedObjects.includes(-1)) 
                                        ?   locale.texts.SHOW_DEVICES 
                                        :   locale.texts.HIDE_DEVICES 
                                    }
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:toggleShowResidents"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item className="mt-2">
                                <Button 
                                    variant="primary" 
                                    className="mr-1 ml-2 text-capitalize" 
                                    onClick={handleClickButton} 
                                    name="searchedObjectType"
                                    value={[-2, 1, 2]}
                                    active={(this.props.showedObjects.includes(1) || this.props.showedObjects.includes(2))}
                                    disabled={
                                        !(searchedObjectType.includes(1) ||
                                        searchedObjectType.includes(2))
                                    }
                                >
                                    {!(showedObjects.includes(1) || showedObjects.includes(2)) 
                                        ?   locale.texts.SHOW_RESIDENTS
                                        :   locale.texts.HIDE_RESIDENTS 
                                    }
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:cleanPath"}
                            renderNoAccess={()=>null}
                        >
                            <Nav.Item className="mt-2">
                                <Button
                                    variant="primary"
                                    className="mr-1 ml-2"
                                    onClick={handleClickButton}
                                    name="cleanPath"
                                    disabled={(this.props.pathMacAddress == '')}
                                >
                                    {locale.texts.HIDE_PATH}
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <div
                            className="d-flex bd-highligh ml-auto"
                        >
                            {locationMonitorConfig &&
                                Object.keys(locationMonitorConfig).includes(areaId.toString()) &&
                                    <Nav.Item className="mt-2 bd-highligh">    
                                        <Button 
                                            variant="warning" 
                                            className="mr-1 ml-2" 
                                            onClick={handleClickButton} 
                                            name="location"
                                            value={locationMonitorConfig[areaId].enable}
                                            active={!locationMonitorConfig[areaId].enable}                                                            
                                        >
                                            {locationMonitorConfig[areaId].enable 
                                                ? locale.texts.LOCATION_MONITOR_ON 
                                                : locale.texts.LOCATION_MONITOR_OFF
                                            }
                                        </Button>
                                </Nav.Item>                              
                            }
                            {geofenceConfig &&
                                Object.keys(geofenceConfig).includes(areaId.toString()) &&
                                    <div className="d-flex">
                                        <Nav.Item className="mt-2 bd-highligh">    
                                            <Button 
                                                variant="warning" 
                                                className="mr-1 ml-2" 
                                                onClick={handleClickButton} 
                                                name="geofence"
                                                value={geofenceConfig[areaId].enable}
                                                active={!geofenceConfig[areaId].enable}                                                            
                                            >
                                                {geofenceConfig[areaId].enable 
                                                    ? locale.texts.FENCE_ON 
                                                    : locale.texts.FENCE_OFF
                                                }
                                            </Button>
                                        </Nav.Item>
                                        <Nav.Item className="mt-2">
                                            <Button 
                                                variant="outline-primary" 
                                                className="mr-1 ml-2" 
                                                onClick={handleClickButton} 
                                                name="clearAlerts"
                                            >
                                                {locale.texts.CLEAR_ALERTS}
                                            </Button>
                                        </Nav.Item>
                                    </div>
                            }
                        </div>
                    </Nav>
                </div>
            </div>
        )
    }
}