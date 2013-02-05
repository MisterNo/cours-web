var Game = function(){
	var _this = this;
	var sleep = 5;
	this.imageList = {
		"background": "http://localhost/cours-web-static/img/getImage.php?url=forest.jpg&sleep=" + sleep,
		"player-idle": "/cours-web-static/img/getImage.php?url=sprite/idle-1-2-1.png&sleep=" + sleep,
		"player-attack": "/cours-web-static/img/getImage.php?url=sprite/attack-1-2-1.png&sleep=" + sleep,
		"player-move": "/cours-web-static/img/getImage.php?url=sprite/move-1-2-1.png&sleep=" + sleep,
		"mob-idle": "/cours-web-static/img/getImage.php?url=sprite/idle-1.png&sleep=" + sleep,
		"mob-damage": "/cours-web-static/img/getImage.php?url=sprite/damage-1.png&sleep=" + sleep,
		"mob-attack": "/cours-web-static/img/getImage.php?url=sprite/attack-1.png&sleep=" + sleep,
		"mob-death": "/cours-web-static/img/getImage.php?url=sprite/death-1.png&sleep=" + sleep
	};
	this.soundList = {
			
	};
	this.localTime = 0;
	this.globalTime = 0;
	
	//var win = new Window('main-window', document.getElementById("gui"));
	var win = new Window('main-window', document.getElementById("gui"));
	
	infoPage = new InfoPage();
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	infoPage.refreshData(userData);
	this.canvas = $(".scene-view").get(0);
	this.graphics = this.canvas.getContext("2d");
	
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(this.imageList, this.soundList);

	$("#gui").append($("<div>").button().append("Menu").click(function(){
		$(win.root).toggle('fade', 200);
	}));
	$(win.root).hide();

	$("#gui").append($("<div>").button().append("Déconnexion").click(function(){
		location.href = "?logout";
	}));
	
	player = new Player(this.assetManager);
	camera = new Camera(player);

	player.setPosition(3530, 1770);
	
	this.mobList = [];
	this.popMob();
	
	requestAnimFrame(
		function loop() {
			_this.mainLoop();
			requestAnimFrame(loop);
		}					
	);
};
Game.prototype.popMob = function(){
	var _this = this;
	
	if(this.mobList.length < 10){
		var ennemy = new Ennemy(this.assetManager);
		this.mobList.push(ennemy);
	}
	
	setTimeout(function(){
		_this.popMob();
	}, 500 + Math.random() * 2000);
};
Game.prototype.killMob = function(mob){
	var _this = this;
	mob.setSprite("death", function(){
		var newMobList = [];
		for(var i = 0; i < _this.mobList.length; i++){
			if(_this.mobList[i] != mob){
				newMobList.push(_this.mobList[i]);
			}
		}
		_this.mobList = newMobList;
	});
};
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;

	this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	var fadeDuration = 5000;
	if(this.assetManager.isDoneLoading()){
		this.graphics.save();
		camera.render(this.graphics);
		
		this.graphics.drawImage(this.assetManager.getImage("background"), 0, 0);
		player.update(localTimeDelta / 1000);
		player.render(this.graphics);
		for(var i = 0; i < this.mobList.length; i++){
			this.mobList[i].render(this.graphics);
		}
		this.graphics.restore();
	}
	if(!this.assetManager.isDoneLoading() || now - this.assetManager.loadingEndTime < fadeDuration){
		if(this.assetManager.isDoneLoading()){
			this.graphics.globalAlpha = 1 - (now - this.assetManager.loadingEndTime) / fadeDuration;
		}
		this.graphics.fillStyle = "black";
		this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.assetManager.renderLoadingProgress(this.graphics);
		this.graphics.globalAlpha = 1;
	}

};