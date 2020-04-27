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