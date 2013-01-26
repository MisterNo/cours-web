var Character = function(parent){
	if(typeof(parent) == "undefined"){
		return;
	}
	this.parent = parent;
	this.elm = $("<div>").addClass("character");

	this.parent.append(this.elm);

	this.positionListenerList = [];
};

Character.prototype.addPositionListener = function(listener){
	this.positionListenerList.push(listener);
};

Character.prototype.setPosition = function(x, y){
	this.x = parseInt(x);
	this.y = parseInt(y);

	this.elm.css("left", x + "px");
	this.elm.css("top", y + "px");
	
	for(var i = 0; i  < this.positionListenerList.length; i++){
		this.positionListenerList[i](this.x, this.y);
	}
};
Character.prototype.moveTo = function(x, y){
	var _this = this;
	if(this.animHandler){
		this.animHandler.stop(false, false);
	}
	this.animHandler = $.ease({
		x: this.x,
		y: this.y
	}, {
		x: x, 
		y: y
	}, function(o){
		_this.setPosition(o.x, o.y);
	},
	{
		easing: "easeOutCirc",
		duration: 300
	});
};
Character.prototype.move = function(x, y){
	this.moveTo(this.x + x, this.y + y);
};