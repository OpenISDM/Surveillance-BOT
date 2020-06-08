/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        importedObjectQueries.js

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

module.exports = {

    getImportedObject: () => {
        let text = `
            SELECT 
                import_table.name, 
                import_table.asset_control_number,
                import_table.type,
                import_table.id
            FROM import_table WHERE import_table.type = 'patient'
        `;
        
        return text
    }, 

    deleteImporedtObject: (idPackage) => {
        const query = `
            DELETE FROM import_table
            WHERE asset_control_number IN (${idPackage.map(item => `'${item}'`)});
 
        `
        return query
    },

    addImportedObject: (idPackage) => {
        let text =  `
            INSERT INTO import_table (
                name,
                type,
                asset_control_number
            )
            VALUES ${idPackage.map((item) => {
                return `(
                    '${item.name}',
                    '${item.type}',
                    '${item.asset_control_number}'
                )`
            })};
        `
        return text	
    },
}
