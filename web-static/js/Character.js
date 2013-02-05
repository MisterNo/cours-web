var Character = function(){
	this.lastPositionList = [];
	this.positionListenerList = [];
	this.spriteList = {};
	this.currentSprite = false;
	this.revertDirection = false;
};
Character.prototype.createSprite = function(id, url, width, height, colCount, rowCount, loop){
	this.spriteList[id] = new Sprite(id, url, width, height, colCount, rowCount, loop);
};
Character.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim;
	if(this.currentSprite != this.spriteList[spriteId]){
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.currentFrame == this.currentSprite.frameCount - 1){
			if(this.currentSprite){
				this.currentSprite.stop();
				this.currentSprite.hide();
			}
			this.currentSprite = this.spriteList[spriteId];
			this.currentSprite.resetAnim();
			this.currentSprite.play(onComplete);
			this.currentSprite.show();
		}else{
			this.nextSprite = anim;
		}
	}
};
Character.prototype.addPositionListener = function(listener){
	this.positionListenerList.push(listener);
};
Character.prototype.render = function(g){

	if(this.motionBlur){
		if(this.lastPositionList.length >= 5){
			this.lastPositionList.splice(0, 1);
		}
		this.lastPositionList.push({x: this.x, y: this.y});
		
		for(var i = 0; i < this.lastPositionList.length; i++){
			g.save();
			g.globalAlpha = (i + 1) / this.lastPositionList.length;
			g.translate(this.lastPositionList[i].x, this.lastPositionList[i].y);
			if(this.currentSprite){
				this.currentSprite.render(g, this.revertDirection, -(this.lastPositionList.length - 1 - i));
			}
			g.restore();
		}
	}else{
		g.save();
		g.translate(this.x, this.y);
		if(this.currentSprite){
			this.currentSprite.render(g, this.revertDirection);
		}
		g.restore();
	}
};
Character.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;

	
//	this.elm.css("left", Math.round(x) + "px");
//	this.elm.css("top", Math.round(y) + "px");
//	this.elm.css("z-index", Math.round(20 * (y - Player.MIN_Y) / (Player.MAX_Y - Player.MIN_Y)));
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
//	if(Math.abs(x) + Math.abs(y) > 15){
//		this.moveTo(this.x + x, this.y + y);
//	}else{
		this.setPosition(this.x + x, this.y + y);
//	}
};