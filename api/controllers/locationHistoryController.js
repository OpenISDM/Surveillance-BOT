require('dotenv').config();
require('moment-timezone')
const dbQueries = require('../db/dbQueries/locationHistoryQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getLocationHistory: (request, response) => {
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
    },

    getContactTree: (request, response) => {
        let {
            child,
            parents,
            startTime,
            endTime,
        } = request.body
        console.log(parents)
        pool.query(dbQueries.getContactTree(child, parents, startTime, endTime))
        .then(res => {
            console.log(`get contact tree succeed`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get contact tree failed ${err}`)
        })
    }

}