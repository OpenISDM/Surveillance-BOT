/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        descriptionGenerator.js

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


import config from '../config';
import React from 'react';
import AccessControl from '../components/presentational/AccessControl';

export const getDescription = (item, locale) => {
    var foundDeviceDescription = ``; 
    switch(item.object_type) {
        case '0':
            foundDeviceDescription += 
                item.found 
                    ?   `
                        
                        ${getType(item, locale)}

                        ${getACN(item, locale)}
                        
                        ${getPosition(item, locale)}

                        ${getStatus(item, locale)}

                        ${item.currentPosition  
                            ? item.status == 'normal'
                                ? `${item.residence_time} `
                                : ''
                            : ''
                        }  

                        ${item.status == "reserve" 
                            ? `~ ${item.reserved_timestamp_final} ${locale.texts.IS_RESERVED_FOR} ${item.reserved_user_name}`
                            : ''
                        } 
                    `
                    :   `
                        ${getType(item, locale)}

                        ${getACN(item, locale)}
                        
                        ${getSubDescription(item, locale)}
                        
                        ${getStatus(item, locale)}

                    `
            break;
        case '1':
        case '2':

            foundDeviceDescription += `

                ${getName(item, locale)}

                ${getID(item, locale)}

                ${item.currentPosition 
                    ?   `
                
                    ${getAreaName(item, locale)}-

                    ${getPosition(item, locale)}
                `
                    :   ""
                }

                ${item.residence_time ? item.residence_time : ''}

            `    
        break;
    } 
    return foundDeviceDescription
}

export const getSubDescription = (item, locale) => {
    let toReturn = 
        locale.abbr == 'en'
            ?   `
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `${locale.texts.WAS} ${locale.texts.NEAR} ${item.location_description} ${item.residence_time}`
                        : ''
                    : `${locale.texts.NOT_AVAILABLE}`
                } 
            `
            :   `                 
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${item.location_description}`
                        : ''
                    : `${locale.texts.NOT_AVAILABLE}`
                } 
            `
    return toReturn
}

export const getBatteryVolumn = (item, locale, config) => {
    let toReturn = 
        locale.abbr == 'en'
            ?   `
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `, ${locale.texts.WAS} ${locale.texts.NEAR} ${item.location_description} ${item.residence_time}`
                        : ''
                    : `, ${locale.texts.NOT_AVAILABLE}`
                } 
            `
            :   `                 
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `, ${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${item.location_description}`
                        : ''
                    : `, ${locale.texts.NOT_AVAILABLE}`
                } 
            `
    return toReturn
}

export const getName = (item, locale) => {
    return `
        ${item.name},
    `
}

export const getType = (item, locale) => {
    return `
        ${item.type},
    `
}

export const getACN = (item, locale) => {
    return `
        ${locale.texts.ASSET_CONTROL_NUMBER}:
        ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPatientID = (item, locale) => {
    return `
        ${locale.texts.PATIENT_NUMBER}:
        ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPhysicianName = (item, locale) => {
    return `
        ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
    `
}

export const getStatus = (item, locale) => {
    return `
        ${item.status.toUpperCase() === 'NORMAL' 
            ? ''  
            : `${locale.texts[item.status.toUpperCase()]}`
        }
    `
}

export const getPosition = (item, locale) => {
    return `
        ${item.location_description}, 
    `
}

export const getMacaddress = (item, locale) => {
    return (
        <AccessControl
            permission={'form:develop'}
            renderNoAccess={() => null}
        >
            | {locale.texts.MAC_ADDRESS}: {item.mac_address}
        </AccessControl>
    )
}

export const getRSSI = (item, locale) => {
    return (
        <AccessControl
            permission={'form:develop'}
            renderNoAccess={() => null}
        >
            | {locale.texts.RSSI}: {item.rssi}
        </AccessControl>
    )
}

export const getAreaName = (item, locale) => {
    return `
        ${locale.texts.NEAR} ${locale.texts[item.lbeacon_area.value]}
    `
}

export const getID = (item, locale) => {
    return `
        ${locale.texts.ID}: ${item.asset_control_number}${item.currentPosition ? ',' : ""}
    `
}