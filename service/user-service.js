var db = require('mongoskin').db("mongodb://localhost:27017/livemeeting-db", {native_parser:true});

var accounts = db.collection('accounts');

exports.autoLogin = function(user, pass, callback) {
	accounts.findOne({username:user}, function(e, o) {
		if (o){
			o.password == pass ? callback(o) : callback(null);
		} else {
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback) {
	accounts.findOne({username:user,password:pass}, function(e, o) {
		if (o == null){
			callback('Username or password do not match');
		} else {
			callback(null, o);
		}
	});
}

exports.addNewAccount = function(newData, callback) {
	accounts.findOne({username:newData.username}, function(e, o) {
		if (o) {
			callback('Username already taken');
		} else {
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('Email already registered');
				} else {
					if(newData.card!=null && newData.card.length > 0) {
						accounts.findOne({card:newData.card}, function(e, o) {
							if(o) {
								callback('Card number already registered');
							} else {
								accounts.insert(newData, {safe: true}, callback);
							}
						});
					} else {
						accounts.insert(newData, {safe: true}, callback);
					}
				}
			});
		}
	});
}

exports.getUsers = function(user, callback) {
	accounts.find({username:{$ne:user}},{firstName:1,lastName:1,username:1}).toArray( function(e, o){
		callback(o);
	});
}

exports.openChat = function(user, pass, userId, callback) {
	accounts.findOne({username:user}, function(e, o) {
		if (o){
			o.password == pass ? 
				accounts.findOne({username:userId}, function(e, o){callback(o);}) : callback(null);
		} else {
			callback(null);
		}
	});
}

exports.getUserCred = function(card, callback) {
	accounts.findOne({card:card}, function(e, o) {
		if(o) {
			callback(null, o);
		} else {
			callback('No user found with given card no.');
		}
	});
}