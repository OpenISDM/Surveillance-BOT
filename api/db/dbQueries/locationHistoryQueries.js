const getLocationHistory = (key, startTime, endTime, mode) => {
	let query = null
	switch(mode) {
		case 'name':
			query =  `
				SELECT 
					location_history_table.uuid,
					location_history_table.record_timestamp,
					location_history_table.mac_address,
					lbeacon_table.description,
					object_table.name,
					area_table.name AS area
				FROM location_history_table

				LEFT JOIN lbeacon_table 
				ON lbeacon_table.uuid = location_history_table.uuid

				LEFT JOIN object_table 
				ON location_history_table.mac_address = object_table.mac_address

				LEFT JOIN area_table
				ON location_history_table.area_id = area_table.id

				WHERE object_table.name = '${key}'

				${startTime ? `AND record_timestamp >= '${startTime}'` : ""}
				${endTime ? `AND record_timestamp <= '${endTime}'` : ""}

				ORDER BY location_history_table.record_timestamp ASC
			`
			break;
		case "mac": 
			query =  `
				SELECT 
					location_history_table.uuid,
					location_history_table.record_timestamp,
					location_history_table.mac_address,
					lbeacon_table.description,
					object_table.name,
					area_table.name AS area
				FROM location_history_table

				LEFT JOIN lbeacon_table 
				ON lbeacon_table.uuid = location_history_table.uuid

				LEFT JOIN object_table 
				ON location_history_table.mac_address = object_table.mac_address

				LEFT JOIN area_table
				ON location_history_table.area_id = area_table.id

				WHERE location_history_table.mac_address = '${key}'

				${startTime ? `AND record_timestamp >= '${startTime}'` : ""}
				${endTime ? `AND record_timestamp <= '${endTime}'` : ""}

				ORDER BY location_history_table.record_timestamp ASC
			`
			break;
		case "uuid":
			query =  `
				SELECT 
					location_history_table.uuid,
					location_history_table.mac_address,
					lbeacon_table.description,
					area_table.name AS area,
					object_table.name
				FROM location_history_table

				LEFT JOIN lbeacon_table 
				ON lbeacon_table.uuid = location_history_table.uuid

				LEFT JOIN object_table 
				ON location_history_table.mac_address = object_table.mac_address

				LEFT JOIN area_table
				ON location_history_table.area_id = area_table.id

				WHERE location_history_table.uuid = '${key}'
				AND object_table.object_type != 0
				${startTime ? `AND record_timestamp >= '${startTime}'` : ""}
				${endTime ? `AND record_timestamp <= '${endTime}'` : ""}

				GROUP BY 
					location_history_table.mac_address, 
					location_history_table.uuid,
					object_table.name,
					lbeacon_table.description,
					area_table.name,
					location_history_table.area_id

				ORDER BY object_table.name ASC

			`
			break;

	}

	return query
}

module.exports = {
    getLocationHistory
}