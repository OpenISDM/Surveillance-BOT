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
            platform: ['browser', 'tablet', 'mobile']
        },
        {
            name: 'gateway',
            component: (props) => <GatewayTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile']
        }
    ]
}
