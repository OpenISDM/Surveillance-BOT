/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        config.js

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


import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';

const config = {

    VERSION: 'v1.0 b.1872',

    TRACING_INTERVAL_UNIT: 'days',

    TRACING_INTERVAL_VALUE: 1,

    DEFAULT_CONTACT_TREE_INTERVAL_UNIT: 'days',

    DEFAULT_CONTACT_TREE_INTERVAL_VALUE: 1,

    DEFAULT_AREA_ID: 1,

    MAX_CONTACT_TRACING_LEVEL: 6,
    
    DEFAULT_USER: {
        roles: 'guest',
        areas_id: [0],
        permissions:[
            'form:view',
        ],
        locale: 'tw',
        main_area: 0,
    },

    DEFAULT_LOCALE: 'tw' ,

    LOGO: BOT_LOGO,

    getLbeaconDataIntervalTime: process.env.GET_LBEACON_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    getGatewayDataIntervalTime: process.env.GET_GATEWAY_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    FOLDER_PATH: {

        trackingRecord: `tracking_record`
    },

    TIME_FORMAT: 'lll',

    AJAX_STATUS_MAP: {
        LOADING: 'loading',
        SUCCESS: 'succcess',
        NO_RESULT: 'no result',
        WAIT_FOR_SEARCH: 'wait for search',
    },

    PDF_FILENAME_TIME_FORMAT: "YYYY-MM-Do_hh_mm_ss",

    DEFAULT_ROLE: ['system_admin'], 

    ROLES_SELECTION: [
        'system_admin',
    ],

    HEALTH_STATUS_MAP: {
        0: 'normal',
        9999: 'n/a',
    },

    PRODUCT_VERSION_MAP: {
        9999: 'n/a',
    },

    TOAST_PROPS: {
        position: 'bottom-right',
        autoClose: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        draggable: true
    },
}

export default config

