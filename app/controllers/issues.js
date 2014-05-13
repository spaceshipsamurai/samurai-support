var   issues = require('../services/IssuesService');

exports.postIssue = function(req, res) {

    console.log('Posting Issue');

    issues.postIssue(req.body);

    res.send({ success: true });
};