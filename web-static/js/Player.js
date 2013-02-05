var Player = function(assetManager){
	var _this = this;
	Character.call(this);

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

	this.createSprite("idle", assetManager.getImage("player-idle"), 2048, 256, 16, 2, true);
	this.createSprite("attack", assetManager.getImage("player-attack"), 2048, 128, 16, 1, false);
	this.createSprite("move", assetManager.getImage("player-move"), 896, 128, 7, 1, true);
	
	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}

	this.spriteList["move"].frameCount = 6;
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
Player.prototype.render = function(g){
	Character.prototype.render.call(this, g);
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
Player.prototype.onKeyDown = function(k){
	var _this = this;
	this.keyList[k] = true;
	// SPACE
	if(k == 32){
		this.nextAnim = this.lastAnimId;
		this.motionBlur = true;
		this.setSprite("attack", function(){
			_this.motionBlur = false;
			_this.setSprite(_this.nextAnim);
			var killCount = 0;
			for(var i = 0; i < game.mobList.length; i++){
				var mob = game.mobList[i];
				if(Math.abs(mob.x - _this.x) < 80 && Math.abs(mob.y - _this.y) < 20){
					game.killMob(mob);
					killCount++;
				}
			}
			if(killCount > 0){
				camera.shake(3);
				$.coursWeb.api('mobKill', {killCount: killCount}, function(data){
					infoPage.refreshData(data);
				});
			}
		});
	}
};
Player.prototype.onKeyUp = function(k){
	this.keyList[k] = false;
};