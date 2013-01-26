var Player = function(parent){
	var _this = this;
	Character.call(this, parent);
	
	$(document).keypress(function(e){
		_this.onKeyPress(e.which);
	});

	$(document).keyup(function(e){
		_this.onKeyUp(e.which);
	});
	
	this.speed = {
		x: 30,
		y: 10
	};

	this.spriteList = {
		"idle-left": new Sprite(this.elm, "idle-left", "/cours-web-static/img/sprite/revert-idle-1-2-1.png", 2048, 256, 16, 2, true),
		"idle-right": new Sprite(this.elm, "idle-right", "/cours-web-static/img/sprite/idle-1-2-1.png", 2048, 256, 16, 2, true),
		"attack-left": new Sprite(this.elm, "attack-left", "/cours-web-static/img/sprite/revert-attack-1-2-1.png", 2048, 128, 16, 1, false),
		"attack-right": new Sprite(this.elm, "attack-right", "/cours-web-static/img/sprite/attack-1-2-1.png", 2048, 128, 16, 1, false),
		"move-left": new Sprite(this.elm, "move-left", "/cours-web-static/img/sprite/revert-move-1-2-1.png", 896, 128, 7, 1, true),
		"move-right": new Sprite(this.elm, "move-right", "/cours-web-static/img/sprite/move-1-2-1.png", 896, 128, 7, 1, true)
	};

	this.spriteList["move-left"].frameCount = 6;
	this.spriteList["move-right"].frameCount = 6;
	this.revertDirection = false;
	this.setSprite("idle");
};
Player.MIN_Y = 1455;
Player.MAX_Y = 1920;

Player.prototype = new Character();
Player.prototype.init = function(){
};
Player.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim + "-" + (this.revertDirection?"left":"right");
	console.log("new anim " + spriteId);
	if(this.currentSprite != this.spriteList[spriteId]){
		if(this.currentSprite){
			this.currentSprite.stop();
			this.currentSprite.hide();
		}
		this.currentSprite = this.spriteList[spriteId];
		this.currentSprite.resetAnim();
		this.currentSprite.play(onComplete);
		this.currentSprite.show();
	}
};
Player.prototype.onKeyPress = function(k){
	var _this = this;
	var move = true;
	switch(k){
	// Q
	case 113:
	case 81:
		this.revertDirection = true;
		this.move(-this.speed.x, 0);
		break;
	// S
	case 115:
	case 83:
		this.move(0, this.speed.y);
		break;
	// D
	case 100:
	case 68:
		this.revertDirection = false;
		this.move(this.speed.x, 0);
		break;
	// Z
	case 122:
	case 90:
		this.move(0, -this.speed.y);
		break;
	// SPACE
	case 32:
		move = false;
		var lastAnim = this.lastAnimId;
		this.setSprite("attack", function(){
			_this.setSprite(lastAnim);
		});
		break;
	default:
		move = false;
	}
	if(move){
		this.setSprite("move");
	}
};
Player.prototype.onKeyUp = function(k){
	switch(k){
	case 113:
	case 81:
	case 115:
	case 83:
	case 100:
	case 68:
	case 122:
	case 90:
		this.setSprite("idle");
		break;
	}
};