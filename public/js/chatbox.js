var socket = io.connect('http://localhost:3000/chat/socket');

var sent=false;
var received=false;

socket.on('connect', function() {
    socket.emit('subscribe', $("#chatId").html());
});

$('#upl').click(function(){
    $('#timestamp').html(Date.now());
    $(this).next().trigger('click');
});

$('#uplfrm').fileupload({
    add: function (e, data) {
        var msg = $('#timestamp').html()+'_oxo_'+data.files[0].name;
        socket.emit('message_from', {
            room:$("#chatId").html(),
            message:msg,
            source:$("#chatFromId").html(),
            sourceName:$("#chatFromName").html(),
            target:$("#chatToId").html()
        });

        if(received) {
            $('#messages').append("<li><a href='/download/"+msg+"'>"+data.files[0].name+"</a></li>");
        } else {
            prevMsg = $('#messages li:last').html();
            if(prevMsg) {
                $('#messages li:last').remove();
                $('#messages').append("<li>"+prevMsg+"<br><a href='/download/"+msg+"'>"+data.files[0].name+"</a></li>");
            } else {
                $('#messages').append("<li><a href='/download/"+msg+"'>"+data.files[0].name+"</a></li>");
            }
        }
        received = false;
        sent=true;

        data.submit();
    }
})
.bind('fileuploadsubmit', function (e, data) {
    var input = $('#input');
    data.formData = {timestamp: $('#timestamp').html()};
});

$('#msgfrm').submit(function(e) {
    var msg = $('#m').val();
    if(msg || msg.length > 0) {
        socket.emit('message_from', {
            room:$("#chatId").html(),
            message:msg,
            source:$("#chatFromId").html(),
            sourceName:$("#chatFromName").html(),
            target:$("#chatToId").html()
        });
        if(received) {
            $('#messages').append($('<li>').text(msg));
        } else {
            prevMsg = $('#messages li:last').html();
            if(prevMsg) {
                $('#messages li:last').remove();
                $('#messages').append("<li>"+prevMsg+"<br>"+msg+"</li>");
            } else {
                $('#messages').append("<li>"+msg+"</li>");
            }
        }
        $('#m').val('');
        received = false;
        sent=true;
    }
    e.preventDefault();
});

socket.on('message_to', function(data) {
    var filename = null;
    if(data.message.indexOf("_oxo_") > -1) {
        var filename = data.message.substring(data.message.indexOf("_oxo_")+5);
    }
	if(sent) {
        if(filename) {
            $('#messages').append("<li><a href='/download/"+data.message+"'>"+filename+"</a></li>");
        } else {
            $('#messages').append("<li>"+data.message+"</li>");
        }
	} else {
    	prevMsg = $('#messages li:last').html();
    	if(prevMsg) {
	    	$('#messages li:last').remove();
            if(filename) {
                $('#messages').append("<li>"+prevMsg+"<br><a href='/download/"+data.message+"'>"+filename+"</a></li>");
            } else {
                $('#messages').append("<li>"+prevMsg+"<br>"+data.message+"</li>");
            }
    	} else {
            if(filename) {
                $('#messages').append("<li><a href='/download/"+data.message+"'>"+filename+"</a></li>"); 
            } else {
                $('#messages').append("<li>"+data.message+"</li>");
            }
    	}
	}
	received=true;
	sent=false;
}); 