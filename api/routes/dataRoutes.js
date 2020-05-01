const trackingDataRoutes = require('./dataRoutes/trackingDataRoutes');
const lbeaconRoutes = require('./dataRoutes/lbeaconRoutes');
const gatewayRoutes = require('./dataRoutes/gatewayRoutes');
const userRoutes = require('./dataRoutes/userRoutes');
const objectRoutes = require('./dataRoutes/objectRoutes');
const importedObjectRoutes = require('./dataRoutes/importedObjectRoutes');
const locationHistoryRoutes = require('./dataRoutes/locationHistoryRoutes');
const areaRoutes = require('./dataRoutes/areaRoutes');
const fileRoutes =  require('./dataRoutes/fileRoutes');
const roleRoutes = require('./dataRoutes/roleRoutes');

module.exports = app => {
    trackingDataRoutes(app);
    lbeaconRoutes(app);
    gatewayRoutes(app);
    userRoutes(app);
    objectRoutes(app);
    importedObjectRoutes(app);
    locationHistoryRoutes(app);
    areaRoutes(app);
    fileRoutes(app);
    roleRoutes(app);
}