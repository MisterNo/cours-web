var Player = function(parent){
	var _this = this;
	Character.call(this, parent);

	this.centerX = 64;
	this.centerY = 120;
	
	$(document).keyup(function(e){
		_this.onKeyUp(e.which);
	});
	
	$(document).keydown(function(e){
		_this.onKeyDown(e.which);
	});
	
	this.keyList = {};
	
	this.speed = {x: 200, y: 80};
	this.xFactor = this.speed.x / this.speed.y;

	this.spriteList = {
		"idle-left": new Sprite(this.elm, "idle-left", "/cours-web-static/img/sprite/revert-idle-1-2-1.png", 2048, 256, 16, 2, true),
		"idle-right": new Sprite(this.elm, "idle-right", "/cours-web-static/img/sprite/idle-1-2-1.png", 2048, 256, 16, 2, true),
		"attack-left": new Sprite(this.elm, "attack-left", "/cours-web-static/img/sprite/revert-attack-1-2-1.png", 2048, 128, 16, 1, false),
		"attack-right": new Sprite(this.elm, "attack-right", "/cours-web-static/img/sprite/attack-1-2-1.png", 2048, 128, 16, 1, false),
		"move-left": new Sprite(this.elm, "move-left", "/cours-web-static/img/sprite/revert-move-1-2-1.png", 896, 128, 7, 1, true),
		"move-right": new Sprite(this.elm, "move-right", "/cours-web-static/img/sprite/move-1-2-1.png", 896, 128, 7, 1, true)
	};
	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}

	this.spriteList["move-left"].frameCount = 6;
	this.spriteList["move-right"].frameCount = 6;
	this.revertDirection = false;
	this.setSprite("idle");
};
Player.MIN_Y = 1500;
Player.MAX_Y = 1920;
Player.MIN_SCALE = 0.5;
Player.MAX_SCALE = 1.1;

Player.prototype = new Character();
Player.prototype.update = function(deltaTime){
	var move = {x: 0, y: 0};
	// Q
	if(this.keyList[113] || this.keyList[81]){
		this.revertDirection = true;
		move.x = -1;
	}
	// S
	if(this.keyList[115] || this.keyList[83]){
		move.y = 1;
	}
	// D
	if(this.keyList[100] || this.keyList[68]){
		this.revertDirection = false;
		move.x = 1;
	}
	// Z
	if(this.keyList[122] || this.keyList[90]){
		move.y = -1;
	}
	if(move.x != 0 || move.y != 0){
		this.move(move.x * this.speed.x * deltaTime, move.y * this.speed.y * deltaTime);
		this.setSprite("move");
	}else{
		this.setSprite("idle");
	}
};
Player.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
	
	if(this.y != lastY){
		var factor = (y - Player.MIN_Y) / (Player.MAX_Y - Player.MIN_Y);
		this.setScale(factor * (Player.MAX_SCALE - Player.MIN_SCALE) + Player.MIN_SCALE);
	}
};
Player.prototype.setScale = function(scale){
	this.scale = scale;
	for(var i in this.spriteList){
		this.spriteList[i].setScale(this.scale);
	}
};
Player.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim + "-" + (this.revertDirection?"left":"right");
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
Player.prototype.onKeyDown = function(k){
	var _this = this;
	this.keyList[k] = true;
	// SPACE
	if(k == 32){
		this.nextAnim = this.lastAnimId;
		this.setSprite("attack", function(){
			_this.setSprite(_this.nextAnim);
			for(var i = 0; i < game.mobList.length; i++){
				var mob = game.mobList[i];
				if(Math.abs(mob.x - _this.x) < 80 && Math.abs(mob.y - _this.y) < 20){
					game.killMob(mob);
				}
			}
//			camera.shake(3);
		});
	}
};
Player.prototype.onKeyUp = function(k){
	this.keyList[k] = false;
};