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
import BrowserContactTree from '../../platform/browser/BrowserContactTree';

class ContactTree extends React.Component{

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
                    <BrowserContactTree
                        location={this.props.location}
                    /> 
                </BrowserView>
            </Fragment>  
        )
    }
}

export default ContactTree