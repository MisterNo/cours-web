var AssetManager = function(){
	this.images = {};
	this.sounds = {};
	this.imagesError = {};
	this.imagesToLoad = {};
	this.soundsToLoad = {};
	this.loadingStarted = false;
};
AssetManager.prototype.loadImage = function(url, id){
	var _this = this;
	if(!id){
		id = url;
	}
	var img = this.images[id];
	if(!img){
		this.imagesToLoad[id] = url;
		img = new Image();
		img.onload = function(){
			delete _this.imagesToLoad[id];
			_this.assetLoaded();
		};
		img.onerror = function(){
			delete _this.imagesToLoad[id];
			_this.imagesError[id] = id;
			_this.assetLoaded();
		};
		img.src = url;
		this.images[id] = img;
	}else{
		this.assetLoaded();
	}
	return img;
};
AssetManager.prototype.loadSound = function(url, id, onload){
	var _this = this;
	if(!id){
		id = url;
	}
	if(this.sounds[id]){
		this.assetLoaded();
	}else{
		this.soundsToLoad[id] = url;
		var sound = soundManager.createSound({
			id: id,
			url: url,
			autoLoad: true,
			autoPlay: false,
			onload: function() {
				delete _this.soundsToLoad[id];
				_this.assetLoaded();
				if(onload){
					onload(sound);
				}
			},
			volume: 100
		});
		
		sound.playLoop = function(){
			this.play({			
				onfinish: function() {
					if(!this._play || user.data.soundEnabled){
						this.playLoop();
					}
				}
			});
		};
		this.sounds[id] = sound;
	}
	return this.sounds[id];
};

AssetManager.prototype.assetLoaded = function(){
	this.totalAssetLoaded++;
	this.loadingTime = Date.now() - this.loadingStartTime;
	this.loadingEndTime = Date.now();
};
AssetManager.prototype.renderLoadingProgress = function(g){
	var loadingProgress = this.getLoadingProgress();
	var progress = Math.min(100, Math.floor(loadingProgress * 100)) + "%";
//	g.fillStyle = "red";
	g.save();
	g.translate(256, 300);
	var f = 10;
	var x = Math.sin((Date.now() / f % 360) * Math.PI / 180) * loadingProgress * 256 + 256;
	var gradient = g.createLinearGradient(0, 0, 512, 0);
	gradient = g.createRadialGradient(x, 16, 0, x, 16, 100);
	gradient.addColorStop(0, "lightgreen");
	gradient.addColorStop(1, "green");
	g.fillStyle = gradient;
	g.fillRect(0, 0, loadingProgress * 512, 32);
	g.strokeStyle = "white";
	g.strokeRect(0, 0, 512, 32);
	
	g.font = "14px gunship";
	g.fillStyle = "white";
	g.strokeStyle = "black";
	g.lineWidth = 3;
//	g.globalAlpha = 0.7;
	g.textAlign = "center";
	g.strokeText("Chargement : " + progress, 256, 20);
	g.fillText("Chargement : " + progress, 256, 20);
	g.globalAlpha = 1;
	g.lineWidth = 1;

	g.restore();
};

AssetManager.prototype.isDoneLoading = function(){
	return this.totalAssetCount == this.totalAssetLoaded;
};

AssetManager.prototype.startLoading = function(loadingList, soundLoadingList){
	this.loadingStartTime = Date.now();
	
	this.totalAssetLoaded = 0;
	this.totalAssetCount = 0;
	for(var i in loadingList){
		this.totalAssetCount++;
	}
	for(var i in soundLoadingList){
		this.totalAssetCount++;
	}
	this.loadingStarted = true;
	this.isFightLoading = false;
	for(var i in soundLoadingList){
		this.loadSound(soundLoadingList[i], i);
	}
	for(var i in loadingList){
		this.loadImage(loadingList[i], i);
	}
};
AssetManager.prototype.getLoadingProgress = function(){
	if(this.totalAssetCount == 0){
		return 0;
	}else{
		return this.totalAssetLoaded / this.totalAssetCount;
	}
};

AssetManager.prototype.getImage = function(id){
	return this.images[id];
};

AssetManager.prototype.getSound = function(id){
	return this.sounds[id];
};