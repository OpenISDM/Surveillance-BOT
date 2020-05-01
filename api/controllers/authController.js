require('dotenv').config();
require('moment-timezone');
const dbQueries = require('../db/dbQueries/authQueries');
const pool = require('../db/dev/connection');
const bcrypt = require('bcrypt');

module.exports = {

    signin: (request, response) => {
        let { 
            password,
            username
        } = request.body
        username = username.toLowerCase()

        pool.query(dbQueries.signin(username))
            .then(res => {
                if (res.rowCount < 1) {
                    console.log(`signin failed: username or password is incorrect`)
                    response.json({
                        authentication: false,
                        message: "Username or password is incorrect"
                    })
                } else {
                    if (bcrypt.compareSync(password, res.rows[0].password)) {
                        let { 
                            name, 
                            roles, 
                            permissions,
                            mydevice, 
                            freq_search_count,
                            areas_id,
                            id,
                            main_area,
                            locale_id,
                            locale
                        } = res.rows[0]

                        if (main_area && !areas_id.includes(main_area)) {
                            areas_id.push(main_area.toString())
                        }

                        let userInfo = {
                            name,
                            myDevice: mydevice || [],
                            roles,
                            permissions,
                            freqSearchCount: freq_search_count,
                            id,
                            areas_id,
                            main_area,
                            locale_id,
                            locale
                        }

                        /** Set session */
                        request.session.regenerate(()=>{})
                        request.session.user = name

                        response.status(200).json({
                            authentication: true,
                            userInfo
                        })

                        pool.query(dbQueries.setVisitTimestamp(username))
                            .then(res =>  console.log(`sign in success: ${name}`))
                            .catch(err => console.log(`set visit timestamp fails ${err}`))

                    } else {
                        response.json({
                            authentication: false,
                            message: "password is incorrect"
                        })
                    }
                }
            })

            .catch(err => {
                console.log(`sigin fails ${err}`)       
            })
    },

    signout: (req, res) => {
        req.session.destroy(() => {
            console.log('session is destroyed')
        })
        res.status(200).json()
    }
}

