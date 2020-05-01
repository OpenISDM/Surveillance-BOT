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
import TabletPageComponent from '../../platform/tablet/TabletPageComponent';
import BrowserTraceContainer from '../../platform/browser/BrowserTraceContainer';
import MobileTraceContainer from '../../platform/mobile/MobileTraceContainer';

class UserSettingContainer extends React.Component{

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        enableBodyScroll(targetElement);
    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }

    containerModule = userContainerModule
    
    render(){

        return (
            <Fragment>
                <BrowserView>
                    <BrowserTraceContainer
                        location={this.props.location}
                    /> 
                </BrowserView>
                <TabletView>
                    <TabletPageComponent
                        containerModule={this.containerModule}
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

export default UserSettingContainer