require('dotenv').config();
require('moment-timezone');
const dbQueries = require('../db/dbQueries/roleQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getAllRole: (request, response) => {
        pool.query(dbQueries.getAllRole())
            .then(res => {
                console.log('get all roles succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get all roles failed ${err}`)
            })
        
    }

}

