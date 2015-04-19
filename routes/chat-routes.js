var US = require('../service/user-service');

module.exports = function(app,io) {

	app.get('/api/users', function(req, res) {
		US.getUsers(req.cookies.user, function(userList) {
			res.json(userList);
		});
	});

	app.post('/upload',function(req,res){
		res.end("File uploaded.");
	});

	app.get('/download/:fileName', function(req, res) {
		res.download('./fs/'+req.params.fileName);
	});

	app.get('/chat/:userId', function(req, res) {
		US.openChat(req.cookies.user, req.cookies.pass, req.params.userId, function(o) {
			var token=req.params.userId;
			if(req.cookies.user > token) {
				token=req.cookies.user+"_"+token;
			} else {
				token=token+"_"+req.cookies.user;
			}
			res.render('view_chatbox', {
				title:o.firstName+" "+o.lastName, 
				usermsg:"", signout:"",
				chatId:token,
				chatFromId:req.cookies.user,
				chatFromName:req.session.firstName+" "+req.session.lastName,
				chatToId:req.params.userId
			});
		});
	});

	io.of('/chat/socket').on('connection', function(socket) {
		socket.on('available', function(room) {
			socket.join(room);
		});
		socket.on('subscribe', function(room) {
			socket.join(room);
		});
		socket.on('message_from', function(data) {
			var res = [], 
			ns = io.of("/chat/socket");    // the default namespace is "/"
		    if (ns) {
		        for (var id in ns.connected) {
		            if(data.room) {
		                var index = ns.connected[id].rooms.indexOf(data.room) ;
		                if(index !== -1) {
		                    res.push(ns.connected[id]);
		                }
		            } else {
		                res.push(ns.connected[id]);
		            }
		        }
		    }
			if(res.length > 1) {
			    socket.broadcast.to(data.room).emit('message_to', {
			        message: data.message
			    });
			} else {
				socket.join(data.target);
			    socket.broadcast.to(data.target).emit('message_to', {
			        message: data.message,
					source: data.source
			    });
			}
		});
	});

}