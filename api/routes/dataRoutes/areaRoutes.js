let areaController = require('../../controllers/areaController');

module.exports = app => {

    app.route('/data/area')
        .post(areaController.getAreaTable)
}