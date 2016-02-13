// ==== Require necessary packages ===== //
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

// ==== Notification Server Listens at Port 4376 ==== //
server.listen(4376);
console.log("**************NOTIFICATION SERVER STARTED******************");
console.log("PORT: 4367");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ==== All Devices to notify ==== //
var devices = {};


app.post('/api/notify', function(req, res){
	var username = req.body.username;
	var noti = req.body.notification;

	if (devices[username]) {
    	// If the user is in the devices list, send push notification
    	var socket_id = devices[username];
    	io.sockets.connected[socket_id].emit('notification', {
    		notification: noti
    	});

	} else {
		console.log(username + " isn't currently subscribed for push notifications");
	}
	res.send("Notification Sent");
});

var logAllDevicesToConsole = function(){
	console.log(devices);
};


io.on('connection', function (socket) {
  	console.log("A device just connected: " + socket.id);

  	socket.on('client info', function(data){
  		var username = data.username;
  		function addsocketByUsername(){

  		};
  		console.log(username + " has been added to DevicesList");
  		devices[username] = socket.id;
  		socket['username'] = username;
  		logAllDevicesToConsole();
  	});

  	socket.on('disconnect', function(data){
  		console.log(socket.id + " socket # disconnected. Removing from Device List");
  		var username = socket['username'];
  		delete devices[username];
  		logAllDevicesToConsole();
  	});

});