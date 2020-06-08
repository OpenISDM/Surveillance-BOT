/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        trackingDataQueries.js

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


const getTrackingData = (areas_id, key) => {
	const query = `
		SELECT 
			object_table.mac_address,
			object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.last_reported_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
			object_summary_table.base_x,
			object_summary_table.base_y,
			object_table.id,
			object_table.name,
			object_table.type,
			object_table.asset_control_number,
			object_table.area_id,
			object_table.object_type,
			lbeacon_table.description as location_description,
			JSON_BUILD_OBJECT(
				'id', area_table.id,
				'value', area_table.name
			) AS lbeacon_area
		
		FROM object_summary_table

		LEFT JOIN object_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		LEFT JOIN area_table
		ON area_table.id = object_summary_table.updated_by_area

		WHERE object_table.area_id IN (${areas_id.map(id => id)}) 
			AND object_table.object_type != 0

		ORDER BY 
			object_table.type, 
			object_table.asset_control_number
			DESC;
	`
	return query;
}

module.exports = {
	getTrackingData
}
