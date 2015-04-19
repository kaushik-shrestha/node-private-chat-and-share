var US = require('../service/user-service');

module.exports = function(app,io) {

	app.get('/', function(req, res) {
		if(req.cookies.user == undefined || req.cookies.pass == undefined) {
			res.render('view_signin', {
				title:"Sign In - LiveMeeting", usermsg:"", signout:"", hidden:"hidden", msg:""
			});
		} else {
			US.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
				if(o!=null) {
					req.session.user = o;
					res.render('view_chat', {
						title:"LiveMeeting", usermsg:"Hi, "+o.firstName, signout:"Sign out", currUser:o.username
					});
				} else {
					res.render('view_signin', {
						title:"Sign In - LiveMeeting", usermsg:"", signout:"", hidden:"hidden", msg:""
					});
				}
			});
		}
	});

	app.post('/', function(req, res) {
		US.manualLogin(req.body.user, req.body.pass, function(e, o) {
			if (!o) {
				res.render('view_signin', {
					title:"Sign In - LiveMeeting", usermsg:"", signout:"", hidden:"", msg:e
				});
			} else {
			    req.session.user = o;
				res.cookie('user', o.username);
				res.cookie('pass', o.password);
				res.render('view_chat', {
					title:"LiveMeeting", usermsg:"Hi, "+o.firstName, signout:"Sign out", currUser:o.username
				});
			}
		})
	});

	app.get('/signup', function(req, res) {
		if(req.cookies.user == undefined || req.cookies.pass == undefined) {
			res.render('view_signup',{
				title:"Sign Up - LiveMeeting", usermsg:"", signout:"", hidden:"hidden", msg:""
			});
		} else {
			res.redirect('/');
		}
	});

	app.post('/signup', function(req, res) {
		US.addNewAccount({
			firstName 	: req.body.inpFname,
			lastName 	: req.body.inpLname,
			username 	: req.body.inpUsername,
			password	: req.body.inpPassword,
			email 		: req.body.inpEmail,
			card		: req.body.inpCard
		}, function(e) {
			if(e) {
				res.render('view_signup',{
					title:"Sign Up - LiveMeeting", usermsg:"", signout:"", hidden:"", msg:e
				});
			} else {
				res.render('view_signin', {
					title:"Sign In - LiveMeeting", usermsg:"", signout:"", hidden:"", msg:"Registration succesful! Please login"
				});
			}
		});
	});

	app.get('/signout', function(req, res) {
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){
			res.redirect('/');
		});
	});

	app.get('/card/:cardId', function(req, res) {
		US.getUserCred(req.params.cardId, function(e, o){
			if(o) {
				res.json(o);
			} else {
				res.json({err:e});
			}
		});
	});
}