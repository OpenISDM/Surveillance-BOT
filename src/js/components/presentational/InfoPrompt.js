/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        InfoPrompt.js

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
import { Alert } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isTablet,
    CustomView,
    isMobile 
} from 'react-device-detect'

const style = {
    alertText: {
        fontSize: '1.2rem',
        fontWeight: 700
    },
    alertTextTitle: {
        fontSize: '1.2rem',
        color: 'rgba(101, 111, 121, 0.78)',
    },
    alerTextTitleForTablet: {
        fontSize: '1.2rem',
        fontWeight: 500,
        color: 'black'
    }
}

const InfoPrompt = ({
    searchKey,
    searchResult,
}) => {
    const appContext = React.useContext(AppContext);
    const { locale } = appContext
    return (
        <div>
            <CustomView condition={isTablet != true && isMobile != true}>
               <Alert variant='secondary' className='d-flex justify-content-start'>
                    <div 
                        className='text-capitalize mr-2' 
                        style={style.alertTextTitle}
                    >
                        {searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
                    </div>
                    <div 
                        className="mr-1"
                        style={style.alertText}
                    >
                        {searchKey ? searchResult.filter(item => item.found).length : ""}
                    </div>
                    <div >
                        {searchKey && locale.texts.OBJECTS}
                    </div>
                        {searchKey && <div>&nbsp;</div> }
                    <div 
                        className='text-capitalize mr-2' 
                        style={style.alertTextTitle}
                    >
                        {searchKey && `${locale.texts.NOT_FOUND}`}
                    </div>
                    <div 
                        className="mr-1"
                        style={style.alertText}
                    >
                        {searchKey ? searchResult.filter(item => !item.found).length : ""}
                    </div>
                    <div >
                        {searchKey && locale.texts.OBJECTS}
                    </div>
                </Alert>
            </CustomView> 


            <TabletView>
                <div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}</div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey ? searchResult.filter(item => item.found).length : ""}</div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey 
                            ?   
                                locale.texts.OBJECTS
                            :   ""
                        }</div>
                </div>
            </TabletView>
        </div>
    )

}

export default InfoPrompt