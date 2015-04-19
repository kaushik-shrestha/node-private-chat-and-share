$(function() {

	var i=0;

	var socket = io.connect('http://localhost:3000/chat/socket');

	$.ajax({
		type:"GET",
		dataType:"json",
		url:"/api/users",
		error:function(msg,status){
			console.log("Error: "+status);
		},
		success:function(users){
			if(users==null || users.length==0) {
				$("#sidebar").html("No user online");
			} else {
				var userliststr = "";
				for(var i=0; i<users.length; i++) {
					userliststr += "<li id=li-"+users[i].username+"><a href='#''>"+users[i].firstName+" "+users[i].lastName+"</a></li>";
				}
				$('#users').html(userliststr);
				for(var i=0; i<users.length; i++) {
					$('#li-'+users[i].username).click(function() {
    					window.open("/chat/"+this.id.substr(3), "popupWindow", "width=350,height=600,scrollbars=yes");
					});
				}
			}
		}
	});

	socket.emit('available', $("#currUser").html());

	socket.on('message_to', function(data) {
    	if(data.message.indexOf("_oxo_") > -1) {
			$('#pings').append(
				"<li id='"+data.source+"_"+(++i)+"''><a href='#'>"+data.source+
				"</a> sent you a file: <a href='/download/"+data.message+"'>"+data.message.substring(data.message.indexOf("_oxo_")+5)+"</a></li>"
			);
		} else {
			$('#pings').append(
				"<li id='"+data.source+"_"+(++i)+"''><a href='#'>"+data.source+"</a> pinged you: <i>"+data.message+"</i></li>");
		}
		$('#'+data.source+"_"+i).click(function() {
			window.open("/chat/"+data.source, "popupWindow", "width=350,height=600,scrollbars=yes");
		});
	});

});