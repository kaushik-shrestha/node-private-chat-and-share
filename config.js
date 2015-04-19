var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app, io, multer) {

	app.set('view engine', 'html');
	app.engine('html', require('ejs').renderFile);
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public'));
	app.use(cookieParser());
	app.use(bodyParser());
	app.use(session({
		resave: true, 
		saveUninitialized: true, 
		secret: 'zrw3wgwestwT4hrrhdh',
		cookie:{maxAge:3600000} 
	}));
	app.use(multer({ 
			dest: './fs/',
	 		rename: function (fieldname, filename, req) {
	    		return req.body.timestamp+"_oxo_"+filename;
	  		},
			onFileUploadStart: function (file) {
			  console.log(file.originalname + ' is starting to upload...')
			},
			onFileUploadComplete: function (file) {
			  console.log(file.fieldname + ' uploaded to  ' + file.path)
			  done=true;
			}
		})
	);
};
