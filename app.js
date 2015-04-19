var express = require('express');
var multer  = require('multer');

var app = express();

var port = process.env.PORT || 3000;

var io = require('socket.io').listen(app.listen(port));

require('./config')(app, io, multer);
require('./routes/account-routes.js')(app, io);
require('./routes/chat-routes.js')(app, io);

console.log('Application running on http://localhost:' + port);