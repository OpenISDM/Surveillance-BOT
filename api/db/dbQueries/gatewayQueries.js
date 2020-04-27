const getAllGateway = `
	SELECT 
		ip_address, 
		health_status, 
		last_report_timestamp,
		registered_timestamp,
		id,
		api_version,
		product_version,
		abnormal_lbeacon_list,
		comment
	FROM 
		gateway_table 
	ORDER BY ip_address DESC
`;	

const deleteGateway = (idPackage) => {
	const query = `
		DELETE FROM gateway_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}

const editGateway = (formOption) => {
	const text =
		`
		UPDATE gateway_table
		SET 
            comment = $2

		WHERE id = $1
	`;

	const values = [
		formOption.id,
		formOption.comment
	]

	const query = {
		text, 
		values
	};

	return query
}

module.exports = {
    getAllGateway,
	deleteGateway,
	editGateway
}