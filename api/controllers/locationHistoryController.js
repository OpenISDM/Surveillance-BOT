require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/locationHistoryQueries');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(config)

const getLocationHistory = (request, response) => {
    let {
        key,
        startTime,
        endTime,
        mode
    } = request.body

    pool.query(dbQueries.getLocationHistory(key, startTime, endTime, mode))
    .then(res => {
        console.log(`get location history by ${mode} succeed`)
        response.status(200).json(res)
    })
    .catch(err => {
        console.log(`get location history by ${mode} failed ${err}`)
    })
}

module.exports = {
    getLocationHistory
}