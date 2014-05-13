var issuesController = require('../controllers/issues');

module.exports = function(app) {

    app.get('/partials/*', function(req, res) {
        res.render('../../public/views/' + req.params);
    });

    app.post('/issue', issuesController.postIssue);

    app.get('*', function(req, res) {
        res.render('index');
    });

};
