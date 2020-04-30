let authController = require('../controllers/authController');

module.exports = app => {

    app.route('/data/auth/signin')
        .post(authController.signin)
}