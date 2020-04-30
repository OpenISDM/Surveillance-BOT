require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/lbeaconQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getAllLbeacon: (request, response) => {

    let { locale } = request.query;

    pool.query(dbQueries.getLbeaconTable)
        .then(res => {
            console.log('get lbeacon table data succeed')
            res.rows.map(item => {
                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)

        })
        .catch(err => {
            console.log(`get lbeacon table failed ${err}`)
        })        
    },

    deleteLBeacon: (request, response) => {
        const { 
            idPackage
        } = request.body
        pool.query(dbQueries.deleteLBeacon(idPackage))
            .then(res => {
                console.log('delete LBeacon record succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`delete LBeacon failed ${err}`)
            })
    },

    editLbeacon: (request, response) => {
        const { formOption } = request.body
        pool.query(dbQueries.editLbeacon(formOption))
            .then(res => {
                console.log('edit lbeacon succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`edit lbeacon failed ${err}`)
            })
    },
}
