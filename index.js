var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {
	console.log('a user connected');

	var username = null;

	socket.on('chat.message', function (msg) {
		if (!username || !msg) return;

		socket.broadcast.emit('chat.message', username, msg);
		console.log(username + '|' + msg);
	})

	socket.on('disconnect', function () {
		console.log('user disconnected');
		if (username) {
			io.emit('user.disconnected', username);
		}
	})

	socket.on('user.nameSubmitted', function (name) {
		username = name;
		console.log("Username submitted: " + name);
		socket.broadcast.emit('user.connected', name);
	})

	socket.on('user.startedTyping', function () {
		console.log('User typing: ' + username);
		socket.broadcast.emit('user.startedTyping', username);
	});

	socket.on('user.stoppedTyping', function () {
		console.log('User stopped typing: ' + username);
		socket.broadcast.emit('user.stoppedTyping', username);
	});
})

http.listen(3000, function () {
	console.log('listening on *:3000');
});