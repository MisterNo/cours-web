var Camera = function(scene, player){
	var _this = this;
	
	this.scene = scene;
	this.player = player;
	
	this.player.addPositionListener(function(playerX, playerY){
		_this.refreshView(playerX, playerY);
	});
	
	this.x = 0;
	this.y = 0;
	
	this.decalX = 512;
	this.decalY = 300;

};
Camera.SCREEN_WIDTH = 1024;
Camera.SCREEN_HEIGHT = 600;
Camera.SCENE_WIDTH = 4096;
Camera.SCENE_HEIGHT = 2037;
Camera.MIN_X = -Camera.SCENE_WIDTH + Camera.SCREEN_WIDTH;
Camera.MAX_X = -Camera.SCREEN_WIDTH;
Camera.MIN_Y = -Camera.SCENE_HEIGHT + Camera.SCREEN_HEIGHT;
Camera.MAX_Y = 0;

Camera.prototype.refreshView = function(playerX, playerY){
	this.x = -playerX + this.decalX;
	this.y = -playerY + this.decalY;
	if(this.x < Camera.MIN_X){
		this.x = Camera.MIN_X;
	}else if(this.x > Camera.MAX_X){
		this.x = Camera.MAX_X;
	}
	if(this.y < Camera.MIN_Y){
		this.y = Camera.MIN_Y;
	}else if(this.y > Camera.MAX_Y){
		this.y = Camera.MAX_Y;
	}
	this.scene.css("top", this.y + "px");
	this.scene.css("left", this.x + "px");
};