require('dotenv').config();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('../db/dev/connection');

const sessionOptions = {
    store: new pgSession({
        pool,             
        tableName: 'session'   
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        // maxAge: 1000 
    }
}

module.exports = sessionOptions