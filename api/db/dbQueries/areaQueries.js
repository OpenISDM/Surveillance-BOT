const getAreaTable = () => {
	return `
		SELECT 
			id,
			name
		FROM area_table
		;
	`
}

module.exports = {
    getAreaTable
}