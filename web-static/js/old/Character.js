var Character = function(id, scene, baseUrl, baseParam, skinParam, zIndex){
	this.id = id;
	this.baseUrl = baseUrl;
	this.baseParam = baseParam;
	this.skinParam = skinParam;
	this.scene = scene;
	this.name = name;
	this.scale = 1;
	this.x = 0;
	this.y = 0;
	this.isNew = true;
	
	this.elm = $(document.createElement("div"));
	this.elm.css("position", "absolute");
	this.baseZIndex = zIndex;
	this.elm.css("z-index", this.baseZIndex);
	this.elm.addClass("character");
	
	this.damageIndicList = [];
	for(var i = 0; i < Character.DAMAGE_INDIC_POOL_SIZE; i++){
		this.createDamageIndic();
	}
	
	this.effectIndicList = [];
	for(var i = 0; i < Character.EFFECT_INDIC_POOL_SIZE; i++){
		this.createEffectIndic();
	}
	
	this.stunIndicator = $(document.createElement("img"));
	this.stunIndicator.addClass("stun-indicator");
	this.stunIndicator.attr("src", IMG_PATH + "images/fight-effect-stun.gif");
	this.stunIndicator.hide();
	this.elm.append(this.stunIndicator);
	this.cloneList = [];
	
	this.lastEffectTime = 0;
};

Character.Z_INDEX_RANGE = 10;
Character.DAMAGE_INDIC_POOL_SIZE = 5;
Character.EFFECT_INDIC_POOL_SIZE = 2;

Character.getUrlFromData = function(id, skinned, baseUrl, baseParam, skinParam){
	if(!user.data.highQualityEnabled){
		baseUrl = baseUrl.replace(/(lyokoClass|mobType)/, '$1-low');
	}
	return WWW_DATA + baseUrl + id + "-" + baseParam + (skinned?"-" + skinParam:"") + ".png";
};

Character.prototype.createDamageIndic = function(){
	var indic = $(document.createElement("div"));
	indic.addClass("damage-indicator");
	indic.hide();
	this.damageIndicList.push({
		elm: indic,
		used: false
	});
	this.elm.append(indic);
};
Character.prototype.createEffectIndic = function(){
	var indic = $(document.createElement("div"));
	indic.addClass("effect-indicator");
	indic.hide();
	this.effectIndicList.push({
		elm: indic,
		used: false
	});
	this.elm.append(indic);
};

Character.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
	//this.elm.css("z-index", Math.max(this.baseZIndex, this.baseZIndex + Math.round(Character.Z_INDEX_RANGE * (this.y - this.scene.fieldMin) / this.scene.fieldSize)));
	this.refreshPosition();
};
Character.prototype.refreshPosition = function(){
	this.elm.css("top", this.y + "px");
};
this.elm.css("left", this.x + "px");
Character.prototype.getRelativeX = function(x){
	return Math.round((x - this.currentSprite.centerX) * this.scale);
};
Character.prototype.getRelativeY = function(y){
	return Math.round((y - this.currentSprite.centerY) * this.scale);
};
Character.prototype.createSprite = function(id, skinned, width, height, rowCount, colCount, frameCount, loop, centerX, centerY){
	var url = Character.getUrlFromData(id, skinned, this.baseUrl, this.baseParam, this.skinParam);
	var sprite = new Sprite(this.elm, id, url, width, height, rowCount, colCount, loop);
	sprite.character = this;
	if(frameCount){
		sprite.frameCount = frameCount;
	}
	if(centerX && centerY){
		sprite.setCenter(centerX, centerY);
	}
	if(!this.spriteList){
		this.spriteList = {};
		this.currentSprite = sprite;
	}
	this.spriteList[id] = sprite;
	return sprite;
};
Character.prototype.setSprite = function(name, onComplete){
	if(this.spriteList[name]){
		if(this.currentSprite){
			this.currentSprite.hide();
		}
		this.currentSprite = this.spriteList[name];
		this.currentSprite.resetAnim();
		this.currentShadowSprite = this.spriteList[name + '_shadow'];
		this.currentSprite.setScale(this.scale);
		this.currentSprite.show();
		if(onComplete){
			this.currentSprite.play(onComplete);
		}
	}
};
Character.prototype.hide = function(){
	this.elm.hide();
};
Character.prototype.show = function(){
	this.elm.show();
};
Character.prototype.playAnim = function(onComplete){
	this.currentSprite.play(onComplete);
};
Character.prototype.stop = function(){
	this.currentSprite.stop();
};
Character.prototype.play = function(onComplete){
	this.currentSprite.play(onComplete);
};
Character.prototype.setScale = function(scale){
	if(scale != this.scale){
		this.scale = scale;
		if(this.currentSprite){
			this.currentSprite.setScale(this.scale);
		}
		this.refreshPosition();
	}
};
Character.prototype.init = function(){
	for(i in this.spriteList){
		if(this.spriteList[i].init){
			this.spriteList[i].init();
		}
	}
};
Character.prototype.reset = function(){
	this.setAttackSkipped(false);
	this.elm.stop(true, true).show();
	this.elm.css("opacity", 1);
};
Character.prototype.getNextDamageIndic = function(){
	var indic = false;
	for(var i = 0; i < this.damageIndicList.length && !indic; i++){
		if(!this.damageIndicList[i].used){
			indic = this.damageIndicList[i];
		}
	}
	if(!indic){
		indic = this.damageIndicList[0];
	}
	indic.used = true;
	return indic;
};
Character.prototype.getNextEffectIndic = function(){
	var indic = false;
	for(var i = 0; i < this.effectIndicList.length && !indic; i++){
		if(!this.effectIndicList[i].used){
			indic = this.effectIndicList[i];
		}
	}
	if(!indic){
		indic = this.effectIndicList[0];
	}
	indic.used = true;
	return indic;
};
Character.prototype.loseLife = function(lifeLost, side, critical){
	var indic = this.getNextDamageIndic();
	if(critical){
		indic.elm.removeClass().addClass("damage-indicator critical");
	}else{
		indic.elm.removeClass().addClass("damage-indicator");
	}
	indic.elm.stop(true, true).show().html(lifeLost + (critical?" !":""));
	$.ease(-60, 0, function(o){
		indic.elm.css("top", Math.round(o) + "px");
	}, {
		duration: 1500 * (critical?2:1),
		easing: "easeOutBounce"
	});
	$.ease({x:0, a:1}, {x: side?100:-100, a:0}, function(o){
		indic.elm.css("left", Math.round(o.x) + "px");
		indic.elm.css("opacity", Math.pow(o.a, 0.25));
	}, {
		duration: 2000 * (critical?2:1),
		easing: "easeOutCubic",
		complete: function(){
			indic.used = false;
			indic.elm.hide();
		}
	});
};
Character.prototype.drainLife = function(lifeDrained, side, target){
	var indic = this.getNextDamageIndic();
	indic.elm.removeClass().addClass("damage-indicator good");
	indic.elm.stop(true, true).show().html(lifeDrained);
	$.ease({x: target.character.x - this.x, y:target.character.y - this.y - 50, a: 0}, {x: 0, y: -50, a:1}, function(o){
		indic.elm.css("top", Math.round(o.y) + "px");
		indic.elm.css("left", Math.round(o.x) + "px");
		indic.elm.css("opacity", 1 - Math.abs((o.a - 0.5) * 2));
	}, {
		duration: 1500,
		easeIn: "easeInOutExpo",
		complete: function(){
			indic.used = false;
			indic.elm.hide();
		}
	});
};
Character.prototype.absorbDamage = function(absorbedDamage, side){
	var indic = this.getNextDamageIndic();
	indic.elm.removeClass().addClass("damage-indicator neutral");
	indic.elm.stop(true, true).show().html(absorbedDamage + ' <span class="damage-info">' + _("absorbés") + '</span>');
	$.ease(0, 1, function(v){
		var shakeDistance = 1;
		indic.elm.css("top", Math.round((Math.random() * 2 - 1) * shakeDistance + 10) + "px");
		indic.elm.css("left", Math.round((Math.random() * 2 - 1) * shakeDistance) + "px");
		indic.elm.css("opacity", 1 - Math.abs((v - 0.5) * 2));
	}, {
		duration: 1500,
		easeIn: "easeInOutExpo",
		complete: function(){
			indic.used = false;
			indic.elm.hide();
		}
	});
};
Character.prototype.showEffect = function(effectText, delay, extraClass){
	var effectMinDelay = 500;
	var currentTime = $.getTimeMillis();
	var timeElapsed = currentTime - this.lastEffectTime;
	if(!delay){
		delay = 0;
	}
	if(timeElapsed + delay < effectMinDelay){
		delay = effectMinDelay - timeElapsed;
	}
	this.lastEffectTime = currentTime + delay;
	var indic = this.getNextEffectIndic();
	indic.elm.stop(false, false).html(effectText);
	indic.elm.hide();
	if(indic.lastExtraClass){
		indic.elm.removeClass(indic.lastExtraClass);
	}
	if(extraClass){
		indic.lastExtraClass = extraClass;
		indic.elm.addClass(indic.lastExtraClass);
	}
	$.ease({y:0, a:1}, {y: -50, a:0}, function(o){
		indic.elm.show();
		indic.elm.css("top", Math.round(o.y) + "px");
		indic.elm.css("opacity", Math.pow(o.a, 0.25));
	}, {
		duration: 2000,
		delay: delay,
		easing: "easeOutCubic",
		complete: function(){
			indic.used = false;
			indic.elm.hide();
		}
	});
};

Character.prototype.setAttackSkipped = function(on){
	if(on != this.stunIndicatorShown){
		this.stunIndicatorShown = on;
		if(this.stunIndicatorShown){
			this.stunIndicator.show('scale');
		}else{
			this.stunIndicator.hide('fade');
		}
	}
};
Character.prototype.onHit = function(hitInfo, globalHitInfo, role, onComplete, simpleHit){
	var _this = this;
	var diff = Math.abs(hitInfo.lifeAfter - hitInfo.lifeBefore);
	if(globalHitInfo.damageReturn && role == FightManager.CHAR_TARGET){
		this.showEffect(_("Renvoi de dégâts !"));
	}
	this.setAttackSkipped(hitInfo.attackSkipped && hitInfo.attackSkipped > 0);
	if(diff > 0 && !simpleHit){
		var player = fightManager.result.playerList[hitInfo.id];
		var friendElm = fightManager.fightTeamMap[hitInfo.id];
		friendElm.root.effect('pulsate', {times: 5, duration: 100, complete: function(){
			friendElm.root.show();
			if(_this.lifeAnimationListener){
				_this.lifeAnimationListener.stop(false, false);
			}
			_this.lifeAnimationListener = $.ease(hitInfo.lifeBefore, hitInfo.lifeAfter, function(v){
				friendElm.currentLife.html(Math.round(v));
				friendElm.lifeBar.css("width", Math.round(v * 100 / player.startLife) + "%");
			}, {
				easing: "linear", 
				duration: 1000,
				complete: function(){
					if(hitInfo.dead){
						friendElm.root.addClass("locked");
						friendElm.dead.show('fade');
					}
				}
			});
		}});
		if(hitInfo.drainedLife){
			var target = fightManager.result.playerList[globalHitInfo.target.id];
			this.drainLife(hitInfo.drainedLife, hitInfo.team, target);
		}
	}
	if(globalHitInfo.dodgeCancelled && role == FightManager.CHAR_FIGHTER){
		this.showEffect(_("Attaque inesquivable !"));
	}
	if(globalHitInfo.dodge && role == FightManager.CHAR_TARGET){
		if(globalHitInfo.dodgeCancelled){
			setTimeout(function(){
				_this.showEffect(_("Esquive ratée !"));
			}, 500);
		}else{
			this.showEffect(_("Esquivé !"));
			this.setSprite("move");
			if(this.dodgeListener){
				this.dodgeListener.stop(true, true);
			}
			if(!this.originalY){
				this.originalY = this.y;
			}
			this.dodgeListener = $.ease(this.y, this.y + 30, function(v){
				_this.setPosition(_this.x, v);
			},{
				duration: 200,
				complete: function(){
					_this.dodgeListener = $.ease(_this.y, _this.originalY, function(v){
						_this.setPosition(_this.x, v);
					}, {
						complete: function(){
							_this.originalY = false;
							_this.setSprite("idle");
							if(onComplete && !simpleHit){
								setTimeout(onComplete, 1000);
							}
						}
					});
				}
			});
			return;
		}
	}
	var critical = globalHitInfo.criticalHit && role == FightManager.CHAR_TARGET;
	if(critical && !simpleHit){
		this.showEffect(_("Critique !"));
	}
	if(hitInfo.absorbedDamage){
		this.absorbDamage(hitInfo.absorbedDamage, hitInfo.team);
	}
	if(this.cloneSource && !simpleHit){
		this.cloneDeath(onComplete);
	}else if(hitInfo.dead && !simpleHit){
		this.loseLife(hitInfo.damageAfterAbsorbtion, hitInfo.team, critical);
		if(loadingManager.getSound(this.info.identifier + "-hit")){
			loadingManager.getSound(this.info.identifier + "-hit").play();
		}
		this.setAttackSkipped(false);
		this.setSprite("death", function(){
			_this.elm.hide('pulsate', 200);
			if(onComplete){
				onComplete();
			}
		});
		var cloneList = this.cloneList;
		for(var i = 0; i < cloneList.length; i++){
			cloneList[i].cloneDeath();
		}
	}else if(hitInfo.lifeLost > 0){
		if(!simpleHit){
			this.loseLife(hitInfo.damageAfterAbsorbtion, hitInfo.team, critical);
//			this.slowMotion = critical;
		}
		if(loadingManager.getSound(this.info.identifier + "-hit")){
			loadingManager.getSound(this.info.identifier + "-hit").play();
		}
		this.setSprite("damage", function(){
			_this.slowMotion = false;
			_this.setSprite("idle");
			if(onComplete && !simpleHit){
				onComplete();
			}
		});
	}else if(onComplete && !simpleHit){
		onComplete();
	}
};