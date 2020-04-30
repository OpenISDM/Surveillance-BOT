require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/gatewayQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getAllGateway: (request, response) => {

        let { locale } = request.query

        pool.query(dbQueries.getAllGateway)
            .then(res => {
                console.log(`get gateway table succeed`)
                res.rows.map(item => {
                    item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                    item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                })
                response.status(200).json(res)
            })    
            .catch(err => {
                console.log(`get gateway table failed ${err}`)                

            })
    },

    deleteGateway: (request, response) => {
        const { idPackage } = request.body
        pool.query(dbQueries.deleteGateway(idPackage))
            .then(res => {
                console.log('delete Gateway record succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`delete gateway failed ${err}`)
            })
    },

    editGateway: (request, response) => {
        const { formOption } = request.body
        pool.query(dbQueries.editGateway(formOption))
            .then(res => {
                console.log('edit lbeacon succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`edit lbeacon failed ${err}`)
            })
    }

}