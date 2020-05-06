require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const httpsPort = 443;
const path = require('path');
const fs = require('fs')
const https = require('https');
const session = require('express-session');
const validation = require('./api/middlewares/validation');
const sessionOptions = require('./api/config/session');
const dataRoutes = require('./api/routes/dataRoutes');
const authRoutes = require('./api/routes/dataRoutes/authRoutes');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(session(sessionOptions))


// setInterval(db.clearSearchHistory, 86400*process.env.CLEAR_SEARCH_HISTORY_INTERVAL)

app.use(express.static(path.join(__dirname,'dist')));

app.get(/^\/page\/(.*)/, validation.pageChecker, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
})

authRoutes(app);

/** Access control of data retrieving from database by session */
// app.use(validation.authChecker);

/** Data retrieving routes */
dataRoutes(app)

/** privatekey name: private.key
 *  certificate name: certificate.cert or certificate.crt
 *  ca_bundle name: ca.bundle.crt
 */

/** Create self-signed certificate  
 *  >> openssl req -nodes -new -x509 -keyout private.key -out certificate.cert 
 * If it is window os, please refer to https://tecadmin.net/install-openssl-on-windows/ install openssl 
 * and set the environment variables*/

var privateKey = process.env.PRIVATE_KEY && fs.readFileSync(__dirname + `/ssl/${process.env.PRIVATE_KEY}`)
var certificate = process.env.CERTIFICATE && fs.readFileSync(__dirname + `/ssl/${process.env.CERTIFICATE}`) 
var ca_bundle = process.env.CA_BUNDLE && fs.readFileSync(__dirname + `/ssl/${process.env.CA_BUNDLE}`)

var credentials = { 
    key: privateKey, 
    cert: certificate,
    ca: ca_bundle
}

const httpsServer = https.createServer(credentials, app)

// /** Enable HTTPS server */
httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server running on PORT ${httpsPort}`)
})




