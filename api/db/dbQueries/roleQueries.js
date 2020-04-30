
module.exports = {
    
    getAllRole: () => {
        const query = `
            SELECT 
                name 
            FROM roles;
        `
        return query
    },
}