let locationHistoryController = require('../../controllers/locationHistoryController');

module.exports = app => {
    app.route('/data/trace/locationHistory')
        .post(locationHistoryController.getLocationHistory)

    app.route('/data/trace/contactTree')
        .post(locationHistoryController.getContactTree)
}