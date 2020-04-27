require('dotenv').config();
require('moment-timezone');
const dbQueries = require('../db/dbQueries/areaQueries');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config);

const getAreaTable = (request, response) => {
    pool.query(dbQueries.getAreaTable())
        .then(res => {
            console.log("get area table succeed")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get area table failed ${err}`)
        })
}

module.exports = {
    getAreaTable
}

