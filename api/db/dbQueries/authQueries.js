module.exports = {
	signin: (username) => {

		const text =
			`
			WITH 
			user_info
				AS
					(
						SELECT name, password, mydevice, id, main_area, max_search_history_count, locale_id
						FROM user_table
						WHERE name =$1
					)
			,
			roles
				AS
					(
						SELECT 
							user_role.user_id, 
							user_role.role_id, 
							roles.name as role_name 
						FROM user_role
						INNER JOIN roles
						ON roles.id = user_role.role_id
						WHERE user_role.user_id = (SELECT id FROM user_info)
					),
			permissions
				AS
					(
						SELECT roles_permission.role_id, roles_permission.permission_id, permission_table.name as permission_name 
						FROM roles_permission
						INNER JOIN permission_table
						ON roles_permission.permission_id = permission_table.id
						WHERE roles_permission.role_id in (SELECT role_id FROM roles)
					),
			areas
				AS
					(
						SELECT area_id
						FROM user_area
						WHERE user_area.user_id = (SELECT id FROM user_info)
					),
			search_histories
				AS
					(
						SELECT keyword as name, COUNT(id) as value
						FROM search_history where user_id = (SELECT id FROM user_info)
						GROUP BY keyword
					)
			SELECT 
				user_info.name, 
				user_info.password,
				user_info.mydevice, 
				user_info.locale_id,
				array (
					SELECT row_to_json(search_histories) 
					FROM search_histories
				) AS search_history,
				user_info.id,
				user_info.id,
				user_info.locale_id,
				user_info.main_area,
				user_info.max_search_history_count as freq_search_count,
				array (
					SELECT role_name 
					FROM roles
				) AS roles,
				array ( 
					SELECT DISTINCT permission_name 
					FROM permissions 
				) AS permissions, 
				array (
					SELECT area_id::int 
					FROM areas
				) AS areas_id,
				(
					SELECT locales.name 
					FROM locales
					WHERE user_info.locale_id = locales.id
				) AS locale
			FROM user_info
			`;

		const values = [username];

		const query = {
			text,
			values
		};

		return query;
	},

	setVisitTimestamp: (username) => {
		return `
			UPDATE user_table
			SET last_visit_timestamp = NOW()
			WHERE name = '${username}';
		`
	}
}
