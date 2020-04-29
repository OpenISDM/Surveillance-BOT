import React from 'react'
import UserProfile from '../components/container/UserContainer/UserProfile'
import MyDeviceManager from '../components/container/UserContainer/MyDeviceManager'
import MyPatientManager from '../components/container/UserContainer/MyPatientManager'
import TransferredLocationManagement from '../components/container/TransferredLocationManagement'
import RolePermissionManagement from '../components/container/RolePermissionManagement'
import LBeaconTable from '../components/container/LBeaconTable'
import GatewayTable from '../components/container/GatewayTable'
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer'
import MonitorSettingBlock from '../components/container/MonitorSettingBlock'
import GeoFenceSettingBlock from '../components/container/GeoFenceSettingBlock'
import TrackingTable from '../components/container/TrackingTable'
import TrackingHistory from '../components/container/TrackingHistory'
import ObjectEditedRecord from '../components/container/UserContainer/ObjectEditedRecord'
import ShiftChangeRecord from '../components/container/UserContainer/ShiftChangeRecord'
import config from '../config'

export const navbarNavList = [
    {
        name: "home",
        alias: "home",
        path: "/",
    },
    {
        name: "object management",
        alias: "objectManagement",
        path: "/page/objectManagement",
        permission: "route:objectManagement",
        platform: ['browser', 'tablet', 'mobile'],
    },
    {
        name: "tracking history",
        alias: "trackinghistory",
        path: "/page/trace",
        permission: "route:trackingHistory",
        platform: ['browser', 'tablet', 'mobile'],
    },
    {
        name: "system setting",
        alias: "systemSetting",
        path: "/page/systemSetting",
        permission: "route:systemSetting",
        platform: ['browser', 'tablet', 'mobile'],
    },
]

export const userContainerModule = {

    title: "user profile",

    defaultActiveKey: "user_profile",

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

    title: "system setting",

    defaultActiveKey: "user_manager",

    tabList: [
        {
            name: 'user manager',
            permission: "route:bigScreen",
            component: (props) => <AdminManagementContainer {...props}/>,
            platform: ['browser', 'tablet'],
        },
        {
            name: "lbeacon",
            component: (props) => <LBeaconTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile']
        },
        {
            name: "gateway",
            component: (props) => <GatewayTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile']
        }
    ]
}

export const trackingHistoryContainerModule = {

    title: "tracking history",

    defaultActiveKey: "real_time_record",
    
    tabList: [
        {
            name: 'real time record',
            permission: "route:trackingHistory",
            component: (props) => <TrackingTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'historical record',
            permission: "route:trackingHistory",
            component: (props) => <TrackingHistory {...props}/>,
            platform: ['browser', 'tablet'],
        },
    ]
}

export const reportContainerModule = {
    
    title: "report",

    defaultActiveKey: "object_edited_record",
    
    tabList: [
        {
            name: 'object edited record',
            component: (props) => <ObjectEditedRecord {...props} />,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'Shift Change Record',
            component: (props) => <ShiftChangeRecord {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
    ],

}