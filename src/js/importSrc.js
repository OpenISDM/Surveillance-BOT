/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        importSrc.js

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


/** Third party css style sheet */

/** bootstrap source */
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"

/** react-toastify source */
import "../../node_modules/react-toastify/dist/ReactToastify.min.css"

import 'react-toastify/dist/ReactToastify.min.css';

/** General customized css */
import "../css/App.css"

/** BOTCheckbox */
import "../css/BOTCheckbox.css"

import "../css/BOTsidenav.css"

/** ObjectListMenu Component customized css */
import "../css/ObjectListMenu.css"

/** pagination */
import "../css/Pagination.css"

/** Surveillance Component customized css */
import "../css/Leaflet.css"

/** RWD customized css */
import "../css/RWD.css"

/** ToggleSwitch customized css */
import "../css/ToggleSwitch.css"

import "../css/leafletMarkers.css"

import "../css/GridButton.css"

/** leaflet source */

import "leaflet/dist/leaflet.js"

import '../../node_modules/leaflet/dist/leaflet.css';

/** leaflet related source */

import "../css/CustomMarkerCluster.css"

import "../../node_modules/leaflet.markercluster/dist/MarkerCluster.css"

import "../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css"

/** font awesome related source */ 
import "../../node_modules/@fortawesome/fontawesome-free/css/all.css"

/** react-widget */
import 'react-widgets/dist/css/react-widgets.css';


/** search bar */
// import "../../src/css/SearchBar.css"


/** ant design */
// import "../../node_modules/antd/dist/antd.css"





