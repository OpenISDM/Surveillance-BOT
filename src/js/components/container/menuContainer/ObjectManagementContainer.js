import React, { Fragment } from 'react';
import 'react-tabs/style/react-tabs.css';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect';
import MobileObjectManagementContainer from '../../platform/mobile/MobileObjectManagementContainer';
import BrowserObjectManagementContainer from '../../platform/browser/BrowserObjectManagementContainer';
import TabletObjectManagementContainer from '../../platform/tablet/TabletObjectManagementContainer';


class ObjectManagementContainer extends React.Component{
    
    render(){
        return (     
            <Fragment>
                <BrowserView>
                    <BrowserObjectManagementContainer/> 
                </BrowserView>
                <TabletView>
                    <TabletObjectManagementContainer/> 
                </TabletView>
                <MobileOnlyView>
                    <MobileObjectManagementContainer/> 
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default ObjectManagementContainer
