import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';

const config = {

    VERSION: 'v1.0 b.1872',

    TRACING_INTERVAL_UNIT: 'minutes',

    TRACING_INTERVAL_VALUE: 30,

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

    PDF_FILENAME_TIME_FORMAT: "YYYY-MM-Do_hh_mm_ss",

    
    DEFAULT_ROLE: ['care_provider'], 

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

