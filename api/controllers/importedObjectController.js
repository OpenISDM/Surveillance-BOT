require('dotenv').config();
require('moment-timezone');
const exec = require('child_process').execFile;
const dbQueries = require('../db/dbQueries/importedObjectQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getImportedObject: (request, response) => {
        let { locale, areaId } = request.body
        pool.query(dbQueries.getImportedObject())       
            .then(res => {
                console.log(`get imported object`)
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get imported object failed ${err}`)
            })     
    },

    deleteImportedObject: (request, response) => {
        const { idPackage } = request.body 
            pool.query(dbQueries.deleteImporedtObject(idPackage))
            .then(res => {
                console.log('delete imported object succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`delete imported object failed ${err}`)
            })
    },

    addImportedObject: (request, response) => {

        const idPackage = request.body.newData
            pool.query(dbQueries.addImportedObject(idPackage))
            .then(res => {
                console.log("add imported objects succeed");
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(` ${err}`)
            })   
    },
}

