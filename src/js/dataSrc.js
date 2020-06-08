/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        dataSrc.js

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


dataSrcIP = process.env.DATASRC_IP;
dataSrcProtocol = process.env.DATASRC_PROTOCOL || 'https'
domain = `${dataSrcProtocol}://${dataSrcIP}`;

module.exports = {

    trackingData: `${domain}/data/trackingData`,

    lbeacon: `${domain}/data/lbeacon`,

    gateway: `${domain}/data/gateway`,

    user: `${domain}/data/user`,

    userInfo: {
        area: {
            secondary: `${domain}/data/user/area/secondary`,
        },
        password: `${domain}/data/user/password`,
        locale: `${domain}/data/user/locale`,
    },

    object: `${domain}/data/object`,

    importedObject: `${domain}/data/importedObject`,

    trace: {
        locationHistory: `${domain}/data/trace/locationHistory`,
       
        contactTree: `${domain}/data/trace/contactTree`,
    },

    area: `${domain}/data/area`,

    role: `${domain}/data/role`,

    auth: {
        signin: `${domain}/data/auth/signin`,
        signout: `${domain}/data/auth/signout`,
    },

    file: {
        export: {
            csv: `${domain}/data/file/export/csv`,
            pdf: `${domain}/data/file/export/pdf`,
        }
    },

    pdfUrl: path => {
        return `${domain}/data/file/${path}`
    }
}

