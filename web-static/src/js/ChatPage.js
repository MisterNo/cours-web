var ChatPage = function(){
	var _this = this;
	Page.call(this, "");
	
	this.client = new Client("localhost", 1234, function(message){
		_this.result.append("<div>" + message + "</div>");
	});
	this.input = $("<input/>").attr("type", "text");
	this.append(this.input);
	
	this.sendButton = $("<span/>").html("Envoyer").button();
	this.sendButton.click(function(){
		_this.client.send(userData.login + " : " + _this.input.get(0).value);
		_this.input.get(0).value = "";
	});
	this.append(this.sendButton);

	this.result = $("<div>").addClass("chat-box");
	this.append(this.result);
};
ChatPage.prototype = new Page();
