/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        retrieveDataHelper.js

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


import dataSrc from '../dataSrc';
import axios from 'axios';
import config from '../config';

const retrieveDataHelper = {
    
    /**
     * get tracking data from object_summary_table
     * @param {*} locale: the abbr in locale context
     * @param {*} userInfo: the user object in auth
     * @param {*} areaId: the area_id of current area or the area_id in stateReducer
     */
    getTrackingData: async function (
        locale, 
        user, 
        areaId
    ) {
        return await axios.post(dataSrc.trackingData,{
            locale,
            user,
            areaId,
        })
    },
    
    /**
     * get object data from object_table
     */
    getObjectTable: async function(
        locale, 
        areas_id, 
        objectType
    ){
        return await axios.get(dataSrc.object, {
            params: {
                locale,
                areas_id,
                objectType,
            }
        })
    },

    getAreaTable: async function() {
        return await axios.post(dataSrc.area)
    },

    getLbeaconTable: async function(locale) {
        return await axios.get(dataSrc.lbeacon, {
            params: {
                locale,
            }
        })
    },

    getGatewayTable: async function(locale) {
        return await axios.get(dataSrc.gateway, {
            params: {
                locale
            }
        })
    },

    getMonitorConfig: async function(
        type, 
        areasId,
        isGetLbeaconPosition
    ) {
        
        return await axios.post(dataSrc.getMonitorConfig, {
            type: config.monitorSettingUrlMap[type],
            areasId,
            isGetLbeaconPosition,
        })
    },

    getEditObjectRecord: async function(locale) {
        return await axios.post(dataSrc.getEditObjectRecord,{
            locale
        })
    },

    setMonitorEnable: async function(
        enable,
        areaId,
        type
    ){
        return await axios.post(dataSrc.setMonitorEnable, {
            enable,
            areaId,
            type
        })
    },

    getAllRole: async function () {
        return await axios.get(dataSrc.role)
    }
}


export default retrieveDataHelper
