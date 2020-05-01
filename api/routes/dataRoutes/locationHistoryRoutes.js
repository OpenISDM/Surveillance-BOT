let locationHistoryController = require('../../controllers/locationHistoryController');

module.exports = app => {
    app.route('/data/locationHistory')
        .post(locationHistoryController.getLocationHistory)
}