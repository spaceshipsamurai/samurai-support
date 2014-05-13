var http = require('http'),
    Q = require('q'),
    config = require('../config/config').getConfig();

var currentLogin = {
    isValid: function() {


        //we don't have a value, so we're not valid
        if(!this.value) return false;

        var tokenIndex = this.value.toString().indexOf('Expires');
        //we don't have a valid expiration date
        if(tokenIndex == -1) return false;

        var expiration = this.value.toString().substring(tokenIndex).split('=')[1];
        var expDate = new Date(expiration);


        //our cookie has expired
        if(expDate < new Date()) return false;

        return true;

    },
    value: null
};

var login = function() {

    var deferred = Q.defer();

    if(currentLogin.isValid())
    {
        return Q.resolve();
    }

    var data = 'login='+ config.youtrack.username +'&password=' + config.youtrack.password;

    var options = {
        hostname: 'support.spaceshipsamurai.com',
        port: 80,
        path: '/rest/user/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };

    var request = http.request(options, function(response) {
        response.setEncoding('utf8');
        currentLogin.value = response.headers['set-cookie'];
        deferred.resolve();
    });

    request.on('error', function(e) {
        console.log('error: ' + e.message);
        deferred.reject(e.message);
    });

    request.write(data);
    request.end();

    return deferred.promise;
};

var submitIssue = function(data) {
    var deferred = Q.defer();

    var formData = 'summary='+ data.summary + '&description=' + data['description'] + '&project=support';

    var options = {
        hostname: 'support.spaceshipsamurai.com',
        port: 80,
        path: '/rest/issue',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': formData.length,
            'Cookie': currentLogin.value,
            'Accept': 'application/json'
        }
    };

    var request = http.request(options, function(response) {
        console.log('Status: ' + response.statusText + ' (' + response.statusCode + ')');
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
           var issue = JSON.parse(chunk);
            console.log(JSON.stringify(issue, null, 4));
            deferred.resolve(issue.id);
        });
    });

    request.on('error', function(e) {
        console.log('error: ' + e.message);
        deferred.reject(e.message);
    });

    request.write(formData);

    console.log('submitting issue');
    request.end();

    return deferred.promise;
};

var sendCommands = function(id, commands)
{
    var deferred = Q.defer();

    commands = "command=" + commands;

    var options = {
        hostname: 'support.spaceshipsamurai.com',
        port: 80,
        path: '/rest/issue/' + id + '/execute',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': commands.length,
            'Cookie': currentLogin.value,
            'Accept': 'application/json'
        }
    };

    var request = http.request(options, function(response) {
        console.log('Status: ' + response.statusText + ' (' + response.statusCode + ')');
        deferred.resolve();
    });

    request.on('error', function(e) {
        console.log('error: ' + e.message);
        deferred.reject(e.message);
    });

    request.write(commands);

    console.log('submitting commands');
    request.end();

    return deferred.promise;
}


exports.postIssue = function(data) {

    var issueId;

    login().then(function(){
        console.log('Login Validated');
        submitIssue(data).then(function(id) {
            console.log('post complete: ' + id);
            issueId = id;
        }, function(error) {
            console.log(error);
        }).then(function() {

            if(!data.specialFields) return;

            var commands = [];

            data.specialFields.forEach(function(field) {

                var command = field.name + ' ';

                if(field.type == 'string')
                    command += '"' + field.value + '"';
                else
                    command += field.value;

                commands.push(command);
            });

            console.log(commands.join(" "));
            sendCommands(issueId, commands.join(" "));
        });

    }, function(error) {
        console.log(error);
    });

};
