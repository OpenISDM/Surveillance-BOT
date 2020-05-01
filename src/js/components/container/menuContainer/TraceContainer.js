import React, {Fragment} from 'react';
import { 
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect';
import {
    userContainerModule
} from '../../../config/pageModules';
import BrowserTraceContainer from '../../platform/browser/BrowserTraceContainer';
import MobileTraceContainer from '../../platform/mobile/MobileTraceContainer';
import TabletTraceContainer from '../../platform/tablet/TabletTraceContainer';

class TraceContainer extends React.Component{

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        enableBodyScroll(targetElement);
    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }
    
    render(){

        return (
            <Fragment>
                <BrowserView>
                    <BrowserTraceContainer
                        location={this.props.location}
                    /> 
                </BrowserView>
                <TabletView>
                    <TabletTraceContainer
                        location={this.props.location}
                    /> 
                </TabletView>
                <MobileOnlyView>
                    <MobileTraceContainer
                        location={this.props.location}
                    />
                </MobileOnlyView>
            </Fragment>  
        )
    }
}

export default TraceContainer