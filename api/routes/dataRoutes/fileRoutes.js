let fileController = require('../../controllers/fileController');

module.exports = app => {

    app.route('/data/file/export/csv')
        .post(fileController.exportCSV)

    app.route('/data/file/export/pdf')
        .post(fileController.exportPDF)

    app.route('/data/file/:folder/:file')
        .get(fileController.getFile)

}