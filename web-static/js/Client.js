var Client = function(host, port, handler){
	this.connection = new WebSocket('ws://localhost:1234');
	this.connection.onmessage = function(data){
		console.log("Message received");
		console.log(data);
		handler(data.data);
	};
};
Client.prototype.send = function(data){
	this.connection.send(data);
};