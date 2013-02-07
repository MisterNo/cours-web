var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
});
var port = 1234;
server.listen(port, function() {
	console.log("Server listening on port " + port);
});

wsServer = new WebSocketServer({
    httpServer: server
});

var connectionList = [];
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = connectionList.push(connection) - 1;
    console.log("Connection " + index + " open");
    connection.on('message', function(message) {
    	console.log("Message received : ");
    	console.log(message);
    	for(var i = 0; i < connectionList.length; i++){
    		connectionList[i].sendUTF(message.utf8Data);
    	}
    });

    connection.on('close', function(connection) {
    	console.log("Connection " + index + " closed");
    	connectionList.splice(index, 1);
    });
});