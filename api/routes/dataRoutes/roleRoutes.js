let roleController = require('../../controllers/roleController');
let cors = require('cors');

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/role', cors()) 

    app.route('/data/role')
        .get(roleController.getAllRole)


}
