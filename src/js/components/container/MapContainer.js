import React, { Fragment } from 'react';
import PdfDownloadForm from './PdfDownloadForm'
import { AppContext } from '../../context/AppContext';
import { 
    BrowserView, 
    TabletView, 
    MobileOnlyView, 
} from 'react-device-detect';
import GeneralConfirmForm from '../presentational/GeneralConfirmForm';
import TabletMapContainer from '../platform/tablet/TabletMapContainer';
import MobileMapContainer from '../platform/mobile/MobileMapContainer';
import BrowserMapContainer from '../platform/browser/BrowserMapContainer';

class MapContainer extends React.Component {

    static contextType = AppContext

    state = {
        showPdfDownloadForm: false,
        showConfirmForm: false,
    }

    handleSubmit = (e) => {
        this.props.setMonitor(this.state.type, this.handleCloseModal)
    }

    handleClickButton = (e) => {
        const { name, value } = e.target
        switch(name) {
            case 'clear':
                this.props.handleClearButton();
                break;
            case 'save':
                this.setState({
                    showPdfDownloadForm: true,
                })
                break;
            case 'geofence':
                this.setState({
                    showConfirmForm: true,
                    type: name
                })
                break;
            case 'location':
                this.setState({
                    showConfirmForm: true,
                    type: name
                })
                break;
            case 'clearAlerts':
                this.props.clearAlerts()
                break;
            case 'searchedObjectType':
                this.props.setShowedObjects(value)
                break;
            case 'cleanPath':
                this.props.handleClosePath();
                break;
        }
    }

    handleCloseModal = () => {
        this.setState({
            showPdfDownloadForm: false,
            showConfirmForm: false
        })
    }

    render(){

        const {
            handleClickButton
        } = this

        const {
            pathData,
            showPdfDownloadForm
        } = this.state

        const { 
            hasSearchKey,
            geofenceConfig,
            locationMonitorConfig,
            searchedObjectType,
            showedObjects,
            proccessedTrackingData,
            handleClearButton,
            pathMacAddress,
            searchResult,
            setMonitor,
        } = this.props;

        let propsGroup = {
            proccessedTrackingData,
            hasSearchKey,
            pathData,
            showedObjects,
            searchedObjectType,
            showPdfDownloadForm,
            handleClickButton,
            pathMacAddress,
            handleClearButton,
            geofenceConfig,
            setMonitor,
            locationMonitorConfig
        }
        return(
            <Fragment>
                <BrowserView>
                    <BrowserMapContainer 
                        {...propsGroup}
                    />
                </BrowserView>
                <TabletView>
                    <TabletMapContainer 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileMapContainer 
                        {...propsGroup}
                    />
                </MobileOnlyView>
                <PdfDownloadForm 
                    show={this.state.showPdfDownloadForm}
                    data={this.props.searchResult}
                    handleClose={this.handleCloseModal}
                />
                <GeneralConfirmForm
                    show={this.state.showConfirmForm}
                    handleSubmit={this.handleSubmit}
                    handleClose={this.handleCloseModal}
                />    
            </Fragment>
        )
    }
}

export default MapContainer