/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectManagementContainer.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React from 'react';
import { 
    Fade,
} from 'react-transition-group';
import { 
    Nav,
    Tab,
} from 'react-bootstrap';
import { AppContext } from '../../../context/AppContext';
import AccessControl from '../../presentational/AccessControl';
import ImportPatientTable from '../../presentational/ImportPatientTable';
import {
    BOTContainer,
    BOTNavLink,
    BOTNav,
    PageTitle
} from '../../BOTComponent/styleComponent';
import ObjectTableContainer from './ObjectTableContainer';
import {
    isMobileOnly,
    isTablet
} from 'react-device-detect';
import { 
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';

class ObjectManagementContainer extends React.Component{

    static contextType = AppContext

    defaultActiveKey = 'patients_table'

    componentDidMount = () => {

        /** set the scrollability in body disabled */
        if (isMobileOnly || isTablet) {
            let targetElement = document.querySelector('body')
            enableBodyScroll(targetElement);
        }
    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }
    
    render(){
        const {
            locale
        } = this.context

        return (     
            <BOTContainer>     
                <PageTitle>                                            
                    {locale.texts.OBJECT_MANAGEMENT}
                </PageTitle>
                <Tab.Container 
                    transition={Fade}
                    defaultActiveKey={this.defaultActiveKey}
                >
                    <BOTNav>
                        <Nav.Item>
                            <BOTNavLink eventKey='patients_table'>
                                {locale.texts.PERSONA_LIST}
                            </BOTNavLink>
                        </Nav.Item>
                        <AccessControl
                            permission={'user:importTable'}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey='import_patients'>
                                    {locale.texts.IMPORT_PERSONA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                    </BOTNav>
                    <Tab.Content
                        className='my-3'
                    >
                        <Tab.Pane eventKey='patients_table'>
                            <ObjectTableContainer/> 
                        </Tab.Pane>
                        <AccessControl
                            permission={'user:importTable'}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Tab.Pane eventKey='import_patients'>
                                <ImportPatientTable />
                            </Tab.Pane>
                        </AccessControl>
                    </Tab.Content>
                </Tab.Container>
            </BOTContainer>
        )
    }
}

export default ObjectManagementContainer
