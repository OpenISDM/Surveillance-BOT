/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        pageModules.js

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
import UserProfile from '../components/container/UserContainer/UserProfile';
import LBeaconTable from '../components/container/LBeaconTable';
import GatewayTable from '../components/container/GatewayTable';
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer';

export const navbarNavList = [
    {
        name: 'home',
        alias: 'home',
        path: '/',
    },
    {
        name: 'object management',
        alias: 'objectManagement',
        path: '/page/objectManagement',
        permission: 'route:objectManagement',
    },
    {
        name: 'tracking history',
        alias: 'trackinghistory',
        path: '/page/trace',
        permission: 'route:trackingHistory',
    },
    {
        name: 'system setting',
        alias: 'systemSetting',
        path: '/page/systemSetting',
        permission: 'route:systemSetting',
    },
    {
        name: 'contact tree',
        alias: 'contactTree',
        path: '/page/contactTree',
        permission: 'route:contactTree',
        platform: ['browser']

    },
]

export const userContainerModule = {

    title: 'user profile',

    defaultActiveKey: 'user_profile',

    tabList: [
        {
            name: 'user profile',
            path: 'userProfile',
            href: '#UserProfile',
            component: (props) => <UserProfile />
        },
    ],
}

export const systemSettingModule = {

    title: 'system setting',

    defaultActiveKey: 'user_manager',

    tabList: [
        {
            name: 'user manager',
            permission: 'route:bigScreen',
            component: (props) => <AdminManagementContainer {...props}/>,
        },
        {
            name: 'lbeacon',
            component: (props) => <LBeaconTable {...props}/>,
        },
        {
            name: 'gateway',
            component: (props) => <GatewayTable {...props}/>,
        }
    ]
}
