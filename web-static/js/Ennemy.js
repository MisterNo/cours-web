var Ennemy = function(parent){
	var _this = this;
	Character.call(this, parent);
	
	this.centerX = 64;
	this.centerY = 120;
	
	this.spriteList = {
		"idle": new Sprite(this.elm, "mob-idle", "/cours-web-static/img/sprite/idle-1.png", 2048, 128, 16, 1, true),
		"attack": new Sprite(this.elm, "mob-attack", "/cours-web-static/img/sprite/attack-1.png", 1536, 128, 12, 1, false),
		"death": new Sprite(this.elm, "mob-death", "/cours-web-static/img/sprite/death-1.png", 1792, 128, 14, 1, false),
		"damage": new Sprite(this.elm, "mob-damage", "/cours-web-static/img/sprite/damage-1.png", 1920, 128, 15, 1, false)
	};
	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}

	this.setSprite("idle");
	this.setPosition(Ennemy.MIN_X + Math.random() * (Ennemy.MAX_X - Ennemy.MIN_X), Ennemy.MIN_Y + Math.random() * (Ennemy.MAX_Y - Ennemy.MIN_Y));

	var finalScale = this.scale;
	$.ease(0, 1, function(v){
		_this.elm.css("opacity", v);
		_this.setScale(v * finalScale);
	}, 1000);

};
Ennemy.MIN_Y = 1550;
Ennemy.MAX_Y = 1920;
Ennemy.MIN_X = 2400;
Ennemy.MAX_X = 4000;
Ennemy.MIN_SCALE = 0.3;
Ennemy.MAX_SCALE = 0.8;

Ennemy.prototype = new Character();
Ennemy.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
	
	if(this.y != lastY){
		var factor = (y - Ennemy.MIN_Y) / (Ennemy.MAX_Y - Ennemy.MIN_Y);
		this.setScale(factor * (Ennemy.MAX_SCALE - Ennemy.MIN_SCALE) + Ennemy.MIN_SCALE);
	}
};
Ennemy.prototype.setScale = function(scale){
	this.scale = scale;
	for(var i in this.spriteList){
		this.spriteList[i].setScale(this.scale);
	}
};
Ennemy.prototype.setSprite = function(anim, onComplete){
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