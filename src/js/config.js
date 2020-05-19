import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';

const config = {

    VERSION: 'v1.0 b.1872',

    TRACING_INTERVAL_UNIT: 'days',

    TRACING_INTERVAL_VALUE: 1,

    DEFAULT_CONTACT_TREE_INTERVAL_UNIT: 'days',

    DEFAULT_CONTACT_TREE_INTERVAL_VALUE: 1,

    DEFAULT_AREA_ID: 1,
    
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

