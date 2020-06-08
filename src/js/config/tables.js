/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        tables.js

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


import config from '../config'

const style = {
    column: {
        textAlign: "center",
    },
    textRight: {
        textAlign: "right"
    },
    icon: {
        check: {
            color: "green",
        },
        times: {
            color: "red",
        },
        exclamation: {
            color: "orange",
        },
        circle: {
            color: "green",
        }
    },
    battery:{
        full: {
            color: "green",
        },
        half: {
            color: "orange",
        },
        empty: {
            color: "red",
        }
    }
}


const lbeaconTableColumn = [
    {
        Header: "health status",
        accessor: "health_status",
        width: 100,
        style: style.textRight,
        Cell: props => config.HEALTH_STATUS_MAP[props.value] ? config.HEALTH_STATUS_MAP[props.value] : props.value
    },
    {
        Header: "product_version",
        accessor: "product_version",
        width: 150,
        Cell: props => config.PRODUCT_VERSION_MAP[props.value] ?  config.PRODUCT_VERSION_MAP[props.value] : props.value
    },
    {
        Header: "UUID",
        accessor: "uuid",
        width: 400
    },
    {
        Header: "description",
        accessor: "description",
        width: 130
    },
    {
        Header: "comment",
        accessor: "comment",
        width: 130
    },
    {
        Header: "IP Address",
        accessor: "ip_address",
        width: 150
    },
    {
        Header: "Gateway IP Address",
        accessor: "gateway_ip_address",
        width: 180
    },
    {
        Header: "last reported timestamp",
        accessor: "last_report_timestamp",
        width: 250,
    },
    {
        Header: "api version",
        accessor: 'api_version',
    },
]

const gatewayTableColumn = [
    {
        Header: "health status",
        accessor: "health_status",
        style: style.textRight,
        width: 100,
        Cell: props => config.HEALTH_STATUS_MAP[props.value] ? config.HEALTH_STATUS_MAP[props.value] : props.value
    },
    {
        Header: "product_version",
        accessor: "product_version",
        width: 170,
        Cell: props => config.PRODUCT_VERSION_MAP[props.value] ?  config.PRODUCT_VERSION_MAP[props.value] : props.value
    },
    {
        Header: "IP Address",
        accessor: "ip_address",
        width: 250
    },
    {
        Header: "comment",
        accessor: "comment",
        width: 130
    },
    {
        Header: "last report timestamp",
        accessor: "last_report_timestamp",
        width: 220,
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp",
        width: 220,
    },
    {
        Header: "api version",
        accessor: 'api_version',
    },
    {
        Header: "abnormal lbeacon list",
        accessor: "abnormal_lbeacon_list",
    }
]

const patientTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 250
    },
    {
        Header: "ID",
        accessor: "asset_control_number",
        width: 250,
    },
    {
        Header: "area",
        accessor: "area_name.label",
        width: 200,
    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 250,
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp",
        width: 300,
    }
]

const importTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 200,
    },
    {
        Header: "ID",
        accessor: "asset_control_number",
        width: 200,
    },
]

const objectTableColumn = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Asset Control Number",
        accessor: "asset_control_number",
        width: 200,

    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
    },
    {
        Header: "area",
        accessor: "area_name.label"
    },
    {
        Header: "Status",
        accessor: "status.label",
        width: 150,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location.label"
    },
    {
        Header: "Monitor Type",
        accessor: "monitor_type"
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp"
    }
]


const userInfoTableColumn = [
    {
        Header: "POUND_SIGN",
        accessor: "_id",
        style: style.column,
        width: 60,
    },
    {
        Header: "Name",
        accessor: "name",
        resizable: false,
        width: 150,
    },
    {
        Header: "Roles",
        accessor: "roles",
        width: 200,
    },
    {
        Header: "Main Area",
        accessor: "main_area.label",
        width: 150,
    },
    {
        Header: "secondary areas",
        accessor: "area_ids",
        width: 200,
    },
    {
        Header: "last visited timestamp",
        accessor: "last_visit_timestamp",
        width: 250
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp",
        width: 250,
    },
    
]

const locationHistoryByNameColumns = [
    {
        Header: "area",
        accessor: "area",
        width: 230,
    },
    {
        Header: "start time",
        accessor: "startTime",
        width: 300,
    },
    {
        Header: "end time",
        accessor: "endTime",
        width: 300,
    },
    {
        Header: 'residence time',
        accessor: 'residenceTime',
    }
]


const locationHistoryByNameGroupByUUIDColumns = [
    {
        Header: "area",
        accessor: "area",
        width: 230,
    },
    {
        Header: "start time",
        accessor: "startTime",
        width: 300,
    },
    {
        Header: "end time",
        accessor: "endTime",
        width: 300,
    },
    {
        Header: 'residence time',
        accessor: 'residenceTime',
    }
]

const locationHistoryByNameGroupBYUUIDColumns = [
    {
        Header: "area",
        accessor: "area",
        width: 230,
    },
    {
        Header: "description",
        accessor: "location_description",
        width: 180,
    },
    {
        Header: "UUID",
        accessor: "uuid",
        width: 450,
    },
    {
        Header: "start time",
        accessor: "startTime",
        width: 300,
    },
    {
        Header: "end time",
        accessor: "endTime",
        width: 300,
    },
    {
        Header: 'residence time',
        accessor: 'residenceTime',
    }
]

const locationHistoryByUUIDColumns = [
    {
        Header: "POUND_SIGN",
        accessor: "id",
        width: 50,
    },
    {
        Header: "name",
        accessor: "name",
        width: 250,
    },
    {
        Header: "mac address",
        accessor: "mac_address",
        width: 250,
    },
    {
        Header: "area",
        accessor: "area",
        width: 250,
    },
    {
        Header: "description",
        accessor: "location_description",
        width: 200,
    },
]

const locationHistoryByAreaColumns = [
    {
        Header: "POUND_SIGN",
        accessor: "id",
        width: 50,
    },
    {
        Header: "name",
        accessor: "name",
        width: 250,
    },
    {
        Header: "mac address",
        accessor: "mac_address",
        width: 250,
    },
    {
        Header: "area",
        accessor: "area",
        width: 250,
    },
]



export { 
    lbeaconTableColumn,
    gatewayTableColumn,
    objectTableColumn,
    importTableColumn,
    patientTableColumn,
    userInfoTableColumn,
    locationHistoryByNameColumns,
    locationHistoryByNameGroupBYUUIDColumns,
    locationHistoryByUUIDColumns,
    locationHistoryByAreaColumns
}