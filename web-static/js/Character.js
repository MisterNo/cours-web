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
	this.x = parseFloat(x);
	this.y = parseFloat(y);

	this.elm.css("left", Math.round(x) + "px");
	this.elm.css("top", Math.round(y) + "px");
	this.elm.css("z-index", Math.round(20 * (y - Player.MIN_Y) / (Player.MAX_Y - Player.MIN_Y)));
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
		duration: 100
	});
};
Character.prototype.move = function(x, y){
	if(Math.abs(x) + Math.abs(y) > 15){
		this.moveTo(this.x + x, this.y + y);
	}else{
		this.setPosition(this.x + x, this.y + y);
	}
};