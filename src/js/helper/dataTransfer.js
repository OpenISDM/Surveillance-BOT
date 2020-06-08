/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        dataTransfer.js

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


/** Retrieve the object's offset from object's mac_address.
 * @param   mac_address The mac_address of the object retrieved from DB. 
 * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().*/
export const macAddressToCoordinate = (mac_address, lbeacon_coordinate, dispersity) => {
    const xx = mac_address.slice(15,16);
    const yy = mac_address.slice(16,17);
    const origin_x = lbeacon_coordinate[1] 
    const origin_y = lbeacon_coordinate[0]
    const xxx = origin_x + parseInt(xx, 16) * dispersity;
    const yyy = origin_y + parseInt(yy, 16) * dispersity;
    return [yyy, xxx];
}