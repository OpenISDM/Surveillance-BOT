require('dotenv').config();
require('moment-timezone');
const dbQueries = require('../db/dbQueries/areaQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getAreaTable: (request, response) => {
        pool.query(dbQueries.getAreaTable())
            .then(res => {
                console.log("get area table succeed")
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

}

