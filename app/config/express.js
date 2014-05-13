var express = require('express')

module.exports = function(app, config) {

    app.configure(function() {

        app.set('views', config.rootPath + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.logger('dev'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'Awesome Secret HERE!' }));
        app.use(express.static(config.rootPath + '/public'));

    })

}
