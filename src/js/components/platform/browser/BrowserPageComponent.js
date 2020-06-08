/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserPageComponent.js

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
    Tab,
    ListGroup
} from 'react-bootstrap';
import {
    PageTitle,
    BOTSideNavTitle,
    BOTSideNav
} from '../../BOTComponent/styleComponent';
import LocaleContext from '../../../context/LocaleContext';

const BrowserPageComponent = ({
    containerModule,
    setMessage
}) => {

    let locale = React.useContext(LocaleContext)

    let {
        tabList,
        title,
        defaultActiveKey
    } = containerModule

    return (
        <Tab.Container 
            transition={false} 
            defaultActiveKey={defaultActiveKey}
        >
            <div 
                className="BOTsidenav"
            >
                <BOTSideNavTitle>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </BOTSideNavTitle>
                <ListGroup>
                    {tabList.map((tab, index) => {
                        return (
                            <BOTSideNav
                                key={index}
                                eventKey={tab.name.replace(/ /g, '_')}
                                action
                            >
                                {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                            </BOTSideNav>
                        )
                    })}  
                </ListGroup>  
                
            </div>
            <div
                className="BOTsidemain"
            >
                <Tab.Content>
                {tabList.map((tab, index) => {
                    let props = {
                        type: tab.name,
                        setMessage,
                    }
                    return (
                        <Tab.Pane 
                            eventKey={tab.name.replace(/ /g, '_')}
                            key={tab.name.replace(/ /g, '_')}
                        >
                            <PageTitle>
                                {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                            </PageTitle>
                            <hr/>
                            {tab.component(props)}
                        </Tab.Pane>
                    )
                })}
                </Tab.Content>         
            </div>
        </Tab.Container>
    )
}
export default BrowserPageComponent
