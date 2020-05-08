module.exports = {


	getLocationHistory: (key, startTime, endTime, mode) => {
		let query = null 
		switch(mode) { 
			case 'test':
				query = `
					WITH RECURSIVE tree AS (
						WITH ranges AS (
							SELECT 
								mac_address, 
								area_id, 
								uuid, 
								record_timestamp, 
								battery_voltage, 
								average_rssi, 
								CASE WHEN LAG(uuid) OVER (PARTITION BY mac_address ORDER BY mac_address, record_timestamp) = uuid 
									THEN NULL ELSE 1 END r
							FROM 
							(			 
								SELECT 
									location_history_table.mac_address AS mac_address,
									location_history_table.area_id AS area_id,
									location_history_table.uuid AS uuid,
									location_history_table.record_timestamp AS record_timestamp,
									location_history_table.battery_voltage AS battery_voltage,
									location_history_table.average_rssi AS average_rssi
								FROM location_history_table 

								INNER JOIN object_table
								ON location_history_table.mac_address = object_table.mac_address
									AND object_table.object_type != 0

								INNER JOIN user_area
								ON object_table.area_id = user_area.area_id

								INNER JOIN user_table 
								ON user_table.id = user_area.user_id

								WHERE 
									object_table.name = 'joe chou'
									AND record_timestamp >= '${startTime}'
									AND record_timestamp <= '${endTime}'

							) AS raw_data
						)
						, groups AS (
							SELECT 
								mac_address, 
								area_id, 
								uuid, 
								record_timestamp, 
								battery_voltage, 
								average_rssi, 
								r, 
								SUM(r) OVER (ORDER BY mac_address, record_timestamp) grp
							FROM ranges
						)

						SELECT 
							NULL AS parent,
							MIN(object_table.name) AS child,
							MIN(groups.mac_address::TEXT) AS mac_address, 
							MIN(lbeacon_table.description) AS beacon_description,
							MIN(groups.uuid::TEXT) AS uuid,
							MIN(groups.record_timestamp) AS start_time,
							MAX(groups.record_timestamp) AS end_time
						FROM groups

						INNER JOIN object_table
						ON object_table.mac_address = groups.mac_address

						INNER JOIN area_table
						ON area_table.id = groups.area_id

						INNER JOIN lbeacon_table
						ON lbeacon_table.uuid = groups.uuid

						GROUP BY grp, groups.mac_address

						UNION 

							SELECT 
								tree.child AS parent,
								child,
								l.mac_address,
								uuid,
								start_time,
								end_time
							FROM (
								SELECT
									l.uuid,
									l.mac_address,
									object_table.name AS child,
									MAX(l.record_timestamp) AS end_time,
									MIN(l.record_timestamp) AS start_time
								FROM location_history_table AS l

								LEFT JOIN object_table 
								ON l.mac_address::text = object_table.mac_address::text

								INNER JOIN tree
								l.uuid::text = tree.uuid::text
									AND l.record_timestamp >= tree.start_time
									AND l.record_timestamp <= tree.end_time	
									AND l.mac_address::text != tree.mac_address::text

								GROUP BY 
									l.uuid,
									l.mac_address
							) as sub

							INNER JOIN tree 
							ON tree.child = sub.parent
							
					)

					SELECT
						*
					FROM tree;
				`;
			break;
				
			case 'name':
				query = `
					WITH ranges AS (
						SELECT 
							mac_address, 
							area_id, 
							uuid, 
							record_timestamp, 
							battery_voltage, 
							average_rssi, 
							CASE WHEN LAG(uuid) OVER (PARTITION BY mac_address ORDER BY mac_address, record_timestamp) = uuid 
								THEN NULL ELSE 1 END r
						FROM 
						(			 
							SELECT 
								location_history_table.mac_address AS mac_address,
								location_history_table.area_id AS area_id,
								location_history_table.uuid AS uuid,
								location_history_table.record_timestamp AS record_timestamp,
								location_history_table.battery_voltage AS battery_voltage,
								location_history_table.average_rssi AS average_rssi
							FROM location_history_table 

							INNER JOIN object_table
							ON location_history_table.mac_address = object_table.mac_address
								AND object_table.object_type != 0

							INNER JOIN user_area
							ON object_table.area_id = user_area.area_id

							INNER JOIN user_table 
							ON user_table.id = user_area.user_id

							WHERE 
								object_table.name = 'joe chou'
								AND record_timestamp >= '${startTime}'
								AND record_timestamp <= '${endTime}'

						) AS raw_data
					)
					, groups AS (
						SELECT mac_address, area_id, uuid, record_timestamp, battery_voltage, average_rssi, r, 
							SUM(r) 
								OVER (ORDER BY mac_address, record_timestamp) grp
						FROM ranges
					)

					SELECT 
						MIN(groups.mac_address::TEXT) AS mac_address, 
						MIN(object_table.name) AS name,
						MIN(groups.area_id) AS area_id,
						MIN(area_table.name) AS area_name,
						MIN(groups.uuid::TEXT) AS uuid,
						MIN(lbeacon_table.description) AS beacon_description,
						MIN(groups.battery_voltage) AS battery_voltage,
						AVG(groups.average_rssi) AS avg_rssi,
						MIN(groups.record_timestamp) AS start_time,
						MAX(groups.record_timestamp) AS end_time,
						MAX(groups.record_timestamp) - MIN(groups.record_timestamp) AS duration
					FROM groups

					INNER JOIN object_table
					ON object_table.mac_address = groups.mac_address

					INNER JOIN area_table
					ON area_table.id = groups.area_id

					INNER JOIN lbeacon_table
					ON lbeacon_table.uuid = groups.uuid

					GROUP BY grp, groups.mac_address
					ORDER by mac_address ASC, start_time DESC
				`;
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
						AND record_timestamp >= '${startTime}'
						AND record_timestamp <= '${endTime}'

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
	},

	getContactTree: (child, parents, startTime, endTime) => {
		let query = `
			WITH parent AS (
				WITH ranges AS (
					SELECT 
						mac_address, 
						area_id, 
						uuid, 
						record_timestamp, 
						battery_voltage, 
						average_rssi, 
						CASE WHEN LAG(uuid) OVER (PARTITION BY mac_address ORDER BY mac_address, record_timestamp) = uuid 
							THEN NULL ELSE 1 END r
					FROM 
					(			 
						SELECT 
							location_history_table.mac_address AS mac_address,
							location_history_table.area_id AS area_id,
							location_history_table.uuid AS uuid,
							location_history_table.record_timestamp AS record_timestamp,
							location_history_table.battery_voltage AS battery_voltage,
							location_history_table.average_rssi AS average_rssi
						FROM location_history_table 

						INNER JOIN object_table
						ON location_history_table.mac_address = object_table.mac_address
							AND object_table.object_type != 0

						INNER JOIN user_area
						ON object_table.area_id = user_area.area_id

						INNER JOIN user_table 
						ON user_table.id = user_area.user_id

						WHERE 
							object_table.name = '${child}'
							AND record_timestamp >= '${startTime}'
							AND record_timestamp <= '${endTime}'

					) AS raw_data
				)
				, groups AS (
					SELECT mac_address, area_id, uuid, record_timestamp, battery_voltage, average_rssi, r, 
						SUM(r) 
							OVER (ORDER BY mac_address, record_timestamp) grp
					FROM ranges
				)

				SELECT 
					MIN(groups.mac_address::TEXT) AS mac_address, 
					MIN(object_table.name) AS name,
					MIN(groups.area_id) AS area_id,
					MIN(area_table.name) AS area_name,
					MIN(groups.uuid::TEXT) AS uuid,
					MIN(lbeacon_table.description) AS beacon_description,
					MIN(groups.battery_voltage) AS battery_voltage,
					AVG(groups.average_rssi) AS avg_rssi,
					MIN(groups.record_timestamp) AS start_time,
					MAX(groups.record_timestamp) AS end_time,
					MAX(groups.record_timestamp) - MIN(groups.record_timestamp) AS duration
				FROM groups

				INNER JOIN object_table
				ON object_table.mac_address = groups.mac_address

				INNER JOIN area_table
				ON area_table.id = groups.area_id

				INNER JOIN lbeacon_table
				ON lbeacon_table.uuid = groups.uuid

				GROUP BY grp, groups.mac_address
				ORDER by mac_address ASC, start_time DESC
			)
			
			SELECT 
				parent.name AS parent,
				parent.beacon_description,
				object_table.name AS child,
				parent.mac_address AS parent_mac,
				MIN(children.record_timestamp) AS start_time,
				MAX(children.record_timestamp) AS end_time

			FROM parent

			LEFT JOIN location_history_table AS children
			ON children.uuid::text = parent.uuid::text
			AND children.record_timestamp >= parent.start_time
			AND children.record_timestamp <= parent.end_time
			AND children.mac_address::text != parent.mac_address::text

			LEFT JOIN object_table 
			ON children.mac_address = object_table.mac_address

			${parents.length != 0 ? `WHERE object_table.name NOT IN (${parents.map(name => `'${name}'`)})` : ""}

			GROUP BY 
				child, 
				parent.beacon_description,
				parent,
				parent_mac

			ORDER BY 
				parent.beacon_description DESC, 
				child ASC,
				start_time ASC
			
			`;
		return query

	}

}
