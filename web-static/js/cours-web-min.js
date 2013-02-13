var AssetManager=function(){this.images={};this.sounds={};this.imagesError={};this.imagesToLoad={};this.soundsToLoad={};this.loadingStarted=false};AssetManager.prototype.loadImage=function(url,id){var _this=this;if(!id){id=url}var img=this.images[id];if(!img){this.imagesToLoad[id]=url;img=new Image;img.onload=function(){delete _this.imagesToLoad[id];_this.assetLoaded()};img.onerror=function(){delete _this.imagesToLoad[id];_this.imagesError[id]=id;_this.assetLoaded()};img.src=url;this.images[id]=img}else{this.assetLoaded()}return img};AssetManager.prototype.loadSound=function(url,id,onload){var _this=this;if(!id){id=url}if(this.sounds[id]){this.assetLoaded()}else{this.soundsToLoad[id]=url;var sound=soundManager.createSound({id:id,url:url,autoLoad:true,autoPlay:false,onload:function(){delete _this.soundsToLoad[id];_this.assetLoaded();if(onload){onload(sound)}},volume:100});sound.playLoop=function(){this.play({onfinish:function(){if(!this._play||user.data.soundEnabled){this.playLoop()}}})};this.sounds[id]=sound}return this.sounds[id]};AssetManager.prototype.assetLoaded=function(){this.totalAssetLoaded++;this.loadingTime=Date.now()-this.loadingStartTime;this.loadingEndTime=Date.now()};AssetManager.prototype.renderLoadingProgress=function(g){var loadingProgress=this.getLoadingProgress();var progress=Math.min(100,Math.floor(loadingProgress*100))+"%";g.save();g.translate(256,300);var f=10;var x=Math.sin(Date.now()/f%360*Math.PI/180)*loadingProgress*256+256;var gradient=g.createLinearGradient(0,0,512,0);gradient=g.createRadialGradient(x,16,0,x,16,100);gradient.addColorStop(0,"lightgreen");gradient.addColorStop(1,"green");g.fillStyle=gradient;g.fillRect(0,0,loadingProgress*512,32);g.strokeStyle="white";g.strokeRect(0,0,512,32);g.font="14px gunship";g.fillStyle="white";g.strokeStyle="black";g.lineWidth=3;g.textAlign="center";g.strokeText("Chargement : "+progress,256,20);g.fillText("Chargement : "+progress,256,20);g.globalAlpha=1;g.lineWidth=1;g.restore()};AssetManager.prototype.isDoneLoading=function(){return this.totalAssetCount==this.totalAssetLoaded};AssetManager.prototype.startLoading=function(loadingList,soundLoadingList){this.loadingStartTime=Date.now();this.totalAssetLoaded=0;this.totalAssetCount=0;for(var i in loadingList){this.totalAssetCount++}for(var i in soundLoadingList){this.totalAssetCount++}this.loadingStarted=true;this.isFightLoading=false;for(var i in soundLoadingList){this.loadSound(soundLoadingList[i],i)}for(var i in loadingList){this.loadImage(loadingList[i],i)}};AssetManager.prototype.getLoadingProgress=function(){if(this.totalAssetCount==0){return 0}else{return this.totalAssetLoaded/this.totalAssetCount}};AssetManager.prototype.getImage=function(id){return this.images[id]};AssetManager.prototype.getSound=function(id){return this.sounds[id]};var Camera=function(player){var _this=this;this.player=player;this.player.addPositionListener(function(playerX,playerY){_this.refreshView(playerX,playerY)});this.x=0;this.y=0;this.decalX=512;this.decalY=300};Camera.SCREEN_WIDTH=1024;Camera.SCREEN_HEIGHT=600;Camera.SCENE_WIDTH=4096;Camera.SCENE_HEIGHT=2037;Camera.MIN_X=-Camera.SCENE_WIDTH+Camera.SCREEN_WIDTH;Camera.MAX_X=0;Camera.MIN_Y=-Camera.SCENE_HEIGHT+Camera.SCREEN_HEIGHT;Camera.MAX_Y=0;Camera.prototype.refreshView=function(playerX,playerY){var _this=this;var newX=-playerX+this.decalX;var newY=-playerY+this.decalY;if(newX<Camera.MIN_X){newX=Camera.MIN_X}else if(newX>Camera.MAX_X){newX=Camera.MAX_X}if(newY<Camera.MIN_Y){newY=Camera.MIN_Y}else if(newY>Camera.MAX_Y){newY=Camera.MAX_Y}_this.legacyX=Math.round(newX);_this.legacyY=Math.round(newY);_this.setViewPosition(Math.round(newX),Math.round(newY))};Camera.SHAKE_SCREEN_DURATION=200;Camera.SHAKE_SCREEN_DISTANCE=1;Camera.prototype.shake=function(factor){var _this=this;if(!factor){factor=1}$.ease(0,1,function(v){_this.setViewPosition(_this.legacyX+Math.round((Math.random()*2-1)*factor*Camera.SHAKE_SCREEN_DISTANCE),_this.legacyY+Math.round((Math.random()*2-1)*factor*Camera.SHAKE_SCREEN_DISTANCE))},{duration:Math.round(Camera.SHAKE_SCREEN_DURATION*factor),complete:function(){_this.setViewPosition(_this.legacyX,_this.legacyY)}})};Camera.prototype.setViewPosition=function(x,y){this.x=x;this.y=y};Camera.prototype.render=function(g){g.translate(this.x,this.y)};var Character=function(){this.lastPositionList=[];this.positionListenerList=[];this.spriteList={};this.currentSprite=false;this.revertDirection=false};Character.prototype.createSprite=function(id,url,width,height,colCount,rowCount,loop){this.spriteList[id]=new Sprite(id,url,width,height,colCount,rowCount,loop)};Character.prototype.setSprite=function(anim,onComplete){this.lastAnimId=anim;var spriteId=anim;if(this.currentSprite!=this.spriteList[spriteId]){if(!this.currentSprite||this.currentSprite.loop||this.currentSprite.currentFrame==this.currentSprite.frameCount-1){if(this.currentSprite){this.currentSprite.stop();this.currentSprite.hide()}this.currentSprite=this.spriteList[spriteId];this.currentSprite.resetAnim();this.currentSprite.play(onComplete);this.currentSprite.show()}else{this.nextSprite=anim}}};Character.prototype.addPositionListener=function(listener){this.positionListenerList.push(listener)};Character.prototype.render=function(g){if(this.motionBlur){if(this.lastPositionList.length>=5){this.lastPositionList.splice(0,1)}this.lastPositionList.push({x:this.x,y:this.y});for(var i=0;i<this.lastPositionList.length;i++){g.save();g.globalAlpha=(i+1)/this.lastPositionList.length;g.translate(this.lastPositionList[i].x,this.lastPositionList[i].y);if(this.currentSprite){this.currentSprite.render(g,this.revertDirection,-(this.lastPositionList.length-1-i))}g.restore()}}else{g.save();g.translate(this.x,this.y);if(this.currentSprite){this.currentSprite.render(g,this.revertDirection)}g.restore()}};Character.prototype.setPosition=function(x,y){this.x=x;this.y=y;for(var i=0;i<this.positionListenerList.length;i++){this.positionListenerList[i](this.x,this.y)}};Character.prototype.moveTo=function(x,y){var _this=this;if(this.animHandler){this.animHandler.stop(false,false)}this.animHandler=$.ease({x:this.x,y:this.y},{x:x,y:y},function(o){_this.setPosition(o.x,o.y)},{easing:"easeOutCirc",duration:100})};Character.prototype.move=function(x,y){this.setPosition(this.x+x,this.y+y)};var ChatPage=function(){var _this=this;Page.call(this,"");this.client=new Client("localhost",1234,function(message){_this.result.append("<div>"+message+"</div>")});this.input=$("<input/>").attr("type","text");this.append(this.input);this.sendButton=$("<span/>").html("Envoyer").button();this.sendButton.click(function(){_this.client.send(userData.login+" : "+_this.input.get(0).value);_this.input.get(0).value=""});this.append(this.sendButton);this.result=$("<div>").addClass("chat-box");this.append(this.result)};ChatPage.prototype=new Page;var Client=function(host,port,handler){this.connection=new WebSocket("ws://localhost:1234");this.connection.onmessage=function(data){console.log("Message received");console.log(data);handler(data.data)}};Client.prototype.send=function(data){this.connection.send(data)};var Ennemy=function(assetManager){var _this=this;Character.call(this);this.centerX=64;this.centerY=120;this.createSprite("idle",assetManager.getImage("mob-idle"),2048,128,16,1,true);this.createSprite("attack",assetManager.getImage("mob-attack"),1536,128,12,1,false);this.createSprite("death",assetManager.getImage("mob-death"),1792,128,14,1,false);this.createSprite("damage",assetManager.getImage("mob-damage"),1920,128,15,1,false);for(var i in this.spriteList){this.spriteList[i].setCenter(this.centerX,this.centerY)}this.setSprite("idle");this.setPosition(Ennemy.MIN_X+Math.random()*(Ennemy.MAX_X-Ennemy.MIN_X),Ennemy.MIN_Y+Math.random()*(Ennemy.MAX_Y-Ennemy.MIN_Y));var finalScale=this.scale;$.ease(0,1,function(v){_this.setScale(v*finalScale)},1e3)};Ennemy.MIN_Y=1550;Ennemy.MAX_Y=1920;Ennemy.MIN_X=2400;Ennemy.MAX_X=4e3;Ennemy.MIN_SCALE=.3;Ennemy.MAX_SCALE=.8;Ennemy.prototype=new Character;Ennemy.prototype.setPosition=function(x,y){var lastY=this.y;Character.prototype.setPosition.call(this,x,y);if(this.y!=lastY){var factor=(y-Ennemy.MIN_Y)/(Ennemy.MAX_Y-Ennemy.MIN_Y);this.setScale(factor*(Ennemy.MAX_SCALE-Ennemy.MIN_SCALE)+Ennemy.MIN_SCALE)}};Ennemy.prototype.setScale=function(scale){this.scale=scale;for(var i in this.spriteList){this.spriteList[i].setScale(this.scale)}};var Game=function(){var _this=this;var sleep=1;this.imageList={background:"/cours-web-static/img/getImage.php?url=forest.jpg&sleep="+sleep,"player-idle":"/cours-web-static/img/getImage.php?url=sprite/idle-1-2-1.png&sleep="+sleep,"player-attack":"/cours-web-static/img/getImage.php?url=sprite/attack-1-2-1.png&sleep="+sleep,"player-move":"/cours-web-static/img/getImage.php?url=sprite/move-1-2-1.png&sleep="+sleep,"mob-idle":"/cours-web-static/img/getImage.php?url=sprite/idle-1.png&sleep="+sleep,"mob-damage":"/cours-web-static/img/getImage.php?url=sprite/damage-1.png&sleep="+sleep,"mob-attack":"/cours-web-static/img/getImage.php?url=sprite/attack-1.png&sleep="+sleep,"mob-death":"/cours-web-static/img/getImage.php?url=sprite/death-1.png&sleep="+sleep};this.soundList={};this.localTime=0;this.globalTime=0;var win=new Window("main-window",document.getElementById("gui"));infoPage=new InfoPage;try{win.addPage("info",infoPage);win.addPage("chat",new ChatPage);win.addPage("equipement",new Page("lorem ipsum"))}catch(e){console.log("New Exception : "+e)}infoPage.refreshData(userData);this.canvas=$(".scene-view").get(0);this.graphics=this.canvas.getContext("2d");this.assetManager=new AssetManager;this.assetManager.startLoading(this.imageList,this.soundList);var menuBar=$("<div>").attr("id","menu-bar");menuBar.append(menuBar);$("#gui").append(menuBar);menuBar.append($("<div>").button().append("Menu").click(function(){if($(win.root).hasClass("visible")){$(win.root).removeClass("visible")}else{$(win.root).addClass("visible")}}));menuBar.append($("<div>").button().append("Déconnexion").click(function(){location.href="?logout"}));player=new Player(this.assetManager);camera=new Camera(player);player.setPosition(3530,1770);this.mobList=[];this.popMob();requestAnimFrame(function loop(){_this.mainLoop();requestAnimFrame(loop)})};Game.prototype.popMob=function(){var _this=this;if(this.mobList.length<10){var ennemy=new Ennemy(this.assetManager);this.mobList.push(ennemy)}setTimeout(function(){_this.popMob()},500+Math.random()*2e3)};Game.prototype.killMob=function(mob){var _this=this;mob.setSprite("death",function(){var newMobList=[];for(var i=0;i<_this.mobList.length;i++){if(_this.mobList[i]!=mob){newMobList.push(_this.mobList[i])}}_this.mobList=newMobList})};Game.prototype.mainLoop=function(){var now=Date.now();var globalTimeDelta=now-this.globalTime;var localTimeDelta=Math.min(50,globalTimeDelta);this.localTime+=localTimeDelta;this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);var fadeDuration=5e3;if(this.assetManager.isDoneLoading()){this.graphics.save();camera.render(this.graphics);this.graphics.drawImage(this.assetManager.getImage("background"),0,0);player.update(localTimeDelta/1e3);player.render(this.graphics);for(var i=0;i<this.mobList.length;i++){this.mobList[i].render(this.graphics)}this.graphics.restore()}if(!this.assetManager.isDoneLoading()||now-this.assetManager.loadingEndTime<fadeDuration){if(this.assetManager.isDoneLoading()){this.graphics.globalAlpha=1-(now-this.assetManager.loadingEndTime)/fadeDuration}this.graphics.fillStyle="black";this.graphics.fillRect(0,0,this.canvas.width,this.canvas.height);this.assetManager.renderLoadingProgress(this.graphics);this.graphics.globalAlpha=1}};var InfoPage=function(){Page.call(this,"");this.playerPreview=$("<div/>").addClass("player-preview");this.append(this.playerPreview);this.playerName=$("<div>").addClass("player-name").append("nom");this.append(this.playerName);this.playerTitle=$("<div>").addClass("player-title").append("title");this.append(this.playerTitle);this.playerProgress=$('<div class="player-progress"/>');this.playerProgressIndic=$('<div class="player-progress-indic"/>');this.playerProgress.append(this.playerProgressIndic);this.append(this.playerProgress);this.attributeContainer=$("<dl>");this.append(this.attributeContainer);this.attributeList={};this.addAttribute("xp","XP");this.addAttribute("hp","HP");this.addAttribute("power","Puissance")};InfoPage.prototype=new Page;InfoPage.prototype.refreshData=function(playerData){for(var i in playerData){switch(i){case"login":this.playerName.html(playerData.login);break;case"title":this.playerTitle.html(playerData.title);break;case"progress":this.playerProgressIndic.css("width",Math.round(playerData.progress*100)+"%");break;default:if(typeof this.attributeList[i]!="undefined"){this.attributeList[i].html(playerData[i]).hide().show("pulsate")}}}};InfoPage.prototype.addAttribute=function(id,label){var dt=$("<dt>").append(label);this.attributeContainer.append(dt);var dd=$("<dd>").addClass(id);this.attributeContainer.append(dd);this.attributeList[id]=dd};var game;function start(){game=new Game}var Page=function(content){this.root=document.createElement("div");this.root.innerHTML=content;this.jRoot=$(this.root)};Page.prototype.append=function(content){if(typeof content=="string"){this.root.innerHTML+=content}else{this.root.appendChild(content.get(0))}};Page.prototype.setVisible=function(visible){if(visible){this.jRoot.show("fade")}else{this.jRoot.hide("fade")}};var Player=function(assetManager){var _this=this;Character.call(this);this.centerX=64;this.centerY=120;$(document).keyup(function(e){_this.onKeyUp(e.which)});$(document).keydown(function(e){_this.onKeyDown(e.which)});this.keyList={};this.speed={x:200,y:80};this.xFactor=this.speed.x/this.speed.y;this.createSprite("idle",assetManager.getImage("player-idle"),2048,256,16,2,true);this.createSprite("attack",assetManager.getImage("player-attack"),2048,128,16,1,false);this.createSprite("move",assetManager.getImage("player-move"),896,128,7,1,true);for(var i in this.spriteList){this.spriteList[i].setCenter(this.centerX,this.centerY)}this.spriteList["move"].frameCount=6;this.revertDirection=false;this.setSprite("idle")};Player.MIN_Y=1500;Player.MAX_Y=1920;Player.MIN_SCALE=.5;Player.MAX_SCALE=1.1;Player.prototype=new Character;Player.prototype.update=function(deltaTime){var move={x:0,y:0};if(this.keyList[113]||this.keyList[81]){this.revertDirection=true;move.x=-1}if(this.keyList[115]||this.keyList[83]){move.y=1}if(this.keyList[100]||this.keyList[68]){this.revertDirection=false;move.x=1}if(this.keyList[122]||this.keyList[90]){move.y=-1}if(move.x!=0||move.y!=0){this.move(move.x*this.speed.x*deltaTime,move.y*this.speed.y*deltaTime);this.setSprite("move")}else{this.setSprite("idle")}};Player.prototype.render=function(g){Character.prototype.render.call(this,g)};Player.prototype.setPosition=function(x,y){var lastY=this.y;Character.prototype.setPosition.call(this,x,y);if(this.y!=lastY){var factor=(y-Player.MIN_Y)/(Player.MAX_Y-Player.MIN_Y);this.setScale(factor*(Player.MAX_SCALE-Player.MIN_SCALE)+Player.MIN_SCALE)}};Player.prototype.setScale=function(scale){this.scale=scale;for(var i in this.spriteList){this.spriteList[i].setScale(this.scale)}};Player.prototype.onKeyDown=function(k){var _this=this;this.keyList[k]=true;if(k==32){this.nextAnim=this.lastAnimId;this.motionBlur=true;this.setSprite("attack",function(){_this.motionBlur=false;_this.setSprite(_this.nextAnim);var killCount=0;for(var i=0;i<game.mobList.length;i++){var mob=game.mobList[i];if(Math.abs(mob.x-_this.x)<80&&Math.abs(mob.y-_this.y)<20){game.killMob(mob);killCount++}}if(killCount>0){camera.shake(3);$.coursWeb.api("mobKill",{killCount:killCount},function(data){infoPage.refreshData(data)})}})}};Player.prototype.onKeyUp=function(k){this.keyList[k]=false};var Sprite=function(id,image,width,height,colCount,rowCount,loop){this.id=id;this.loop=loop;this.parent=parent;this.rowCount=rowCount;this.colCount=colCount;this.frameCount=this.rowCount*this.colCount;this.currentFrame=0;this.setFrameRate(16);this.invert=false;this.invertAnim=false;this.scale=1;this.lastUpdateTime=0;this.imgWidth=width;this.imgHeight=height;this.centerX=0;this.centerY=0;this.x=0;this.y=0;this.img=image;this.onAnimationComplete=false;this.width=Math.round(this.imgWidth/this.colCount);this.height=Math.round(this.imgHeight/this.rowCount);this.flip=false};Sprite.prototype.setPosition=function(x,y){this.x=x;this.y=y;this.refreshPosition()};Sprite.prototype.render=function(g,revertDirection,decalFrame){g.save();var frame=this.currentFrame;if(decalFrame){frame+=this.frameCount-decalFrame}frame=frame%this.frameCount;if(this.invertAnim){frame=this.frameCount-this.currentFrame-1}var col=frame%this.colCount;var row=Math.floor(frame/this.colCount);if(this.invert){col=this.colCount-col-1;row=this.rowCount-row-1}if(revertDirection){g.scale(-this.scale,this.scale)}else{g.scale(this.scale,this.scale)}g.drawImage(this.img,col*this.width,row*this.height,this.width,this.height,-this.width/2,-this.height/2,this.width,this.height);g.restore()};Sprite.prototype.setCenter=function(x,y){this.centerX=x;this.centerY=y;this.refreshPosition()};Sprite.prototype.refreshPosition=function(){};Sprite.prototype.show=function(type,options){if(this.loop){this.currentFrame=0;this.play()}};Sprite.prototype.hide=function(hideType){this.stop()};Sprite.prototype.play=function(onComplete){var _this=this;if(this.player){clearTimeout(this.player)}var frameDuration=this.frameDuration;if(this.character&&this.character.slowMotion){frameDuration=Math.round(frameDuration*1.5)}this.player=setTimeout(function(){_this.nextFrame();if(_this.loop||_this.currentFrame<_this.frameCount-1){_this.play(onComplete)}else if(typeof onComplete=="function"){onComplete(_this)}},frameDuration)};Sprite.prototype.resetAnim=function(){this.stop();this.currentFrame=0};Sprite.prototype.stop=function(){if(this.player){clearTimeout(this.player);this.player=false}};Sprite.prototype.nextFrame=function(frames){if(!frames){frames=1}this.currentFrame=this.currentFrame+frames;if(this.currentFrame>=this.frameCount){if(this.loop){this.currentFrame%=this.frameCount}else{this.currentFrame=this.frameCount-1}}if(this.currentFrame==this.frameCount-1&&!this.loop&&this.onAnimationComplete){this.onAnimationComplete(this);this.onAnimationComplete=false}};Sprite.prototype.setFrameRate=function(frameRate){this.frameRate=frameRate;this.frameDuration=1/this.frameRate*1e3};Sprite.prototype.setScale=function(scale){if(this.scale!=scale){this.scale=scale;this.refreshPosition()}};window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback,element){window.setTimeout(callback,1e3/60)}}();function encrypt(){var form=document.getElementById("connect-form");form.password.value=Aes.Ctr.encrypt(form.password.value,"09ed931e1782289f8f9a42f837a46fa0",256);return true}$.coursWeb={api:function(action,data,callback){var dataToSend={action:action,data:data};$.ajax({url:"api.php",type:"POST",data:{d:Aes.Ctr.encrypt(JSON.stringify(dataToSend),"09ed931e1782289f8f9a42f837a46fa0",256)},error:function(xhr,msg,msg2){alert(msg2)},success:function(data){var clearData=Aes.Ctr.decrypt(data,"09ed931e1782289f8f9a42f837a46fa0",256);var result=JSON.parse(clearData);if(result.error){alert(result.error)}else if(typeof callback=="function"){callback(result)}}})}};$.getTimeMillis=function(){return(new Date).getTime()};$.getTimeFloat=function(){return $.getTimeMillis()/1e3};var localTime=Math.floor((new Date).getTime()/1e3);$.getTime=function(){var timeElapsed=Math.floor($.getTimeFloat())-localTime;return serverTime+timeElapsed};$.getElmRegion=function(elm){var pos=elm.offset();var rootPos=gameManager.root.offset();var posX=pos.left-rootPos.left;var posY=pos.top-rootPos.top;var w=elm.width();var h=elm.height();return{posX:posX,posY:posY,width:w,height:h}};$.ease=function(from,to,func,options){var isObject=true;if(typeof from!="object"){from={v:from};to={v:to};isObject=false}var o={};if(options){for(i in options){o[i]=options[i]}}o.step=function(f){if(isObject){var res={};for(i in from){res[i]=f*(to[i]-from[i])+from[i]}func(res)}else{func(f*(to.v-from.v)+from.v)}};var listener=$({f:0});if(options&&options.delay){listener.delay(options.delay).animate({f:1},o)}else{listener.animate({f:1},o)}return listener};$.shuffle=function(list){var i,j,t;for(i=1;i<list.length;i++){j=Math.floor(Math.random()*(1+i));if(j!=i){t=list[i];list[i]=list[j];list[j]=t}}};var Aes={};Aes.cipher=function(input,w){var Nb=4;var Nr=w.length/Nb-1;var state=[[],[],[],[]];for(var i=0;i<4*Nb;i++)state[i%4][Math.floor(i/4)]=input[i];state=Aes.addRoundKey(state,w,0,Nb);for(var round=1;round<Nr;round++){state=Aes.subBytes(state,Nb);state=Aes.shiftRows(state,Nb);state=Aes.mixColumns(state,Nb);state=Aes.addRoundKey(state,w,round,Nb)}state=Aes.subBytes(state,Nb);state=Aes.shiftRows(state,Nb);state=Aes.addRoundKey(state,w,Nr,Nb);var output=new Array(4*Nb);for(var i=0;i<4*Nb;i++)output[i]=state[i%4][Math.floor(i/4)];return output};Aes.keyExpansion=function(key){var Nb=4;var Nk=key.length/4;var Nr=Nk+6;var w=new Array(Nb*(Nr+1));var temp=new Array(4);for(var i=0;i<Nk;i++){var r=[key[4*i],key[4*i+1],key[4*i+2],key[4*i+3]];w[i]=r}for(var i=Nk;i<Nb*(Nr+1);i++){w[i]=new Array(4);for(var t=0;t<4;t++)temp[t]=w[i-1][t];if(i%Nk==0){temp=Aes.subWord(Aes.rotWord(temp));for(var t=0;t<4;t++)temp[t]^=Aes.rCon[i/Nk][t]}else if(Nk>6&&i%Nk==4){temp=Aes.subWord(temp)}for(var t=0;t<4;t++)w[i][t]=w[i-Nk][t]^temp[t]}return w};Aes.subBytes=function(s,Nb){for(var r=0;r<4;r++){for(var c=0;c<Nb;c++)s[r][c]=Aes.sBox[s[r][c]]}return s};Aes.shiftRows=function(s,Nb){var t=new Array(4);for(var r=1;r<4;r++){for(var c=0;c<4;c++)t[c]=s[r][(c+r)%Nb];for(var c=0;c<4;c++)s[r][c]=t[c]}return s};Aes.mixColumns=function(s,Nb){for(var c=0;c<4;c++){var a=new Array(4);var b=new Array(4);for(var i=0;i<4;i++){a[i]=s[i][c];b[i]=s[i][c]&128?s[i][c]<<1^283:s[i][c]<<1}s[0][c]=b[0]^a[1]^b[1]^a[2]^a[3];s[1][c]=a[0]^b[1]^a[2]^b[2]^a[3];s[2][c]=a[0]^a[1]^b[2]^a[3]^b[3];s[3][c]=a[0]^b[0]^a[1]^a[2]^b[3]}return s};Aes.addRoundKey=function(state,w,rnd,Nb){for(var r=0;r<4;r++){for(var c=0;c<Nb;c++)state[r][c]^=w[rnd*4+c][r]}return state};Aes.subWord=function(w){for(var i=0;i<4;i++)w[i]=Aes.sBox[w[i]];return w};Aes.rotWord=function(w){var tmp=w[0];for(var i=0;i<3;i++)w[i]=w[i+1];w[3]=tmp;return w};Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22];Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]];Aes.Ctr={};Aes.Ctr.encrypt=function(plaintext,password,nBits){var blockSize=16;if(!(nBits==128||nBits==192||nBits==256))return"";plaintext=Utf8.encode(plaintext);password=Utf8.encode(password);var nBytes=nBits/8;var pwBytes=new Array(nBytes);for(var i=0;i<nBytes;i++){pwBytes[i]=isNaN(password.charCodeAt(i))?0:password.charCodeAt(i)}var key=Aes.cipher(pwBytes,Aes.keyExpansion(pwBytes));key=key.concat(key.slice(0,nBytes-16));var counterBlock=new Array(blockSize);var nonce=(new Date).getTime();var nonceMs=nonce%1e3;var nonceSec=Math.floor(nonce/1e3);var nonceRnd=Math.floor(Math.random()*65535);for(var i=0;i<2;i++)counterBlock[i]=nonceMs>>>i*8&255;for(var i=0;i<2;i++)counterBlock[i+2]=nonceRnd>>>i*8&255;for(var i=0;i<4;i++)counterBlock[i+4]=nonceSec>>>i*8&255;var ctrTxt="";for(var i=0;i<8;i++)ctrTxt+=String.fromCharCode(counterBlock[i]);var keySchedule=Aes.keyExpansion(key);var blockCount=Math.ceil(plaintext.length/blockSize);var ciphertxt=new Array(blockCount);for(var b=0;b<blockCount;b++){for(var c=0;c<4;c++)counterBlock[15-c]=b>>>c*8&255;for(var c=0;c<4;c++)counterBlock[15-c-4]=b/4294967296>>>c*8;var cipherCntr=Aes.cipher(counterBlock,keySchedule);var blockLength=b<blockCount-1?blockSize:(plaintext.length-1)%blockSize+1;var cipherChar=new Array(blockLength);for(var i=0;i<blockLength;i++){cipherChar[i]=cipherCntr[i]^plaintext.charCodeAt(b*blockSize+i);cipherChar[i]=String.fromCharCode(cipherChar[i])}ciphertxt[b]=cipherChar.join("")}var ciphertext=ctrTxt+ciphertxt.join("");ciphertext=Base64.encode(ciphertext);return ciphertext};Aes.Ctr.decrypt=function(ciphertext,password,nBits){var blockSize=16;if(!(nBits==128||nBits==192||nBits==256))return"";ciphertext=Base64.decode(ciphertext);password=Utf8.encode(password);var nBytes=nBits/8;var pwBytes=new Array(nBytes);for(var i=0;i<nBytes;i++){pwBytes[i]=isNaN(password.charCodeAt(i))?0:password.charCodeAt(i)}var key=Aes.cipher(pwBytes,Aes.keyExpansion(pwBytes));key=key.concat(key.slice(0,nBytes-16));var counterBlock=new Array(8);ctrTxt=ciphertext.slice(0,8);for(var i=0;i<8;i++)counterBlock[i]=ctrTxt.charCodeAt(i);var keySchedule=Aes.keyExpansion(key);var nBlocks=Math.ceil((ciphertext.length-8)/blockSize);var ct=new Array(nBlocks);for(var b=0;b<nBlocks;b++)ct[b]=ciphertext.slice(8+b*blockSize,8+b*blockSize+blockSize);ciphertext=ct;var plaintxt=new Array(ciphertext.length);for(var b=0;b<nBlocks;b++){for(var c=0;c<4;c++)counterBlock[15-c]=b>>>c*8&255;for(var c=0;c<4;c++)counterBlock[15-c-4]=(b+1)/4294967296-1>>>c*8&255;var cipherCntr=Aes.cipher(counterBlock,keySchedule);var plaintxtByte=new Array(ciphertext[b].length);for(var i=0;i<ciphertext[b].length;i++){plaintxtByte[i]=cipherCntr[i]^ciphertext[b].charCodeAt(i);plaintxtByte[i]=String.fromCharCode(plaintxtByte[i])}plaintxt[b]=plaintxtByte.join("")}var plaintext=plaintxt.join("");plaintext=Utf8.decode(plaintext);return plaintext};var Base64={};Base64.code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";Base64.encode=function(str,utf8encode){utf8encode=typeof utf8encode=="undefined"?false:utf8encode;var o1,o2,o3,bits,h1,h2,h3,h4,e=[],pad="",c,plain,coded;var b64=Base64.code;plain=utf8encode?str.encodeUTF8():str;c=plain.length%3;if(c>0){while(c++<3){pad+="=";plain+="\0"}}for(c=0;c<plain.length;c+=3){o1=plain.charCodeAt(c);o2=plain.charCodeAt(c+1);o3=plain.charCodeAt(c+2);bits=o1<<16|o2<<8|o3;h1=bits>>18&63;h2=bits>>12&63;h3=bits>>6&63;h4=bits&63;e[c/3]=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4)}coded=e.join("");coded=coded.slice(0,coded.length-pad.length)+pad;return coded};Base64.decode=function(str,utf8decode){utf8decode=typeof utf8decode=="undefined"?false:utf8decode;var o1,o2,o3,h1,h2,h3,h4,bits,d=[],plain,coded;var b64=Base64.code;coded=utf8decode?str.decodeUTF8():str;for(var c=0;c<coded.length;c+=4){h1=b64.indexOf(coded.charAt(c));h2=b64.indexOf(coded.charAt(c+1));h3=b64.indexOf(coded.charAt(c+2));h4=b64.indexOf(coded.charAt(c+3));bits=h1<<18|h2<<12|h3<<6|h4;o1=bits>>>16&255;o2=bits>>>8&255;o3=bits&255;d[c/4]=String.fromCharCode(o1,o2,o3);if(h4==64)d[c/4]=String.fromCharCode(o1,o2);if(h3==64)d[c/4]=String.fromCharCode(o1)}plain=d.join("");return utf8decode?plain.decodeUTF8():plain};var Utf8={};Utf8.encode=function(strUni){var strUtf=strUni.replace(/[\u0080-\u07ff]/g,function(c){var cc=c.charCodeAt(0);return String.fromCharCode(192|cc>>6,128|cc&63)});strUtf=strUtf.replace(/[\u0800-\uffff]/g,function(c){var cc=c.charCodeAt(0);return String.fromCharCode(224|cc>>12,128|cc>>6&63,128|cc&63)});return strUtf};Utf8.decode=function(strUtf){var strUni=strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(c){var cc=(c.charCodeAt(0)&15)<<12|(c.charCodeAt(1)&63)<<6|c.charCodeAt(2)&63;return String.fromCharCode(cc)});strUni=strUni.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(c){var cc=(c.charCodeAt(0)&31)<<6|c.charCodeAt(1)&63;return String.fromCharCode(cc)});return strUni};var Window=function(id,parent){this.id=id;this.parent=parent;this.root=document.createElement("div");this.root.className="window";this.parent.appendChild(this.root);this.menu=document.createElement("div");this.menu.className="menu";this.root.appendChild(this.menu);this.menuList=document.createElement("ul");this.menuList.setAttribute("id","main-menu");this.menu.appendChild(this.menuList);this.content=document.createElement("div");this.content.className="content";this.root.appendChild(this.content);this.currentPage=null};Window.prototype.addPage=function(title,page){if(!(page instanceof Page)){throw page+" is not instanceof Page"}var _this=this;this.content.appendChild(page.root);page.root.style.display="none";var menuElm=document.createElement("li");menuElm.innerHTML="<div>"+title+"</div>";menuElm.page=page;menuElm.addEventListener("click",function(){_this.showPage(menuElm)});this.menuList.appendChild(menuElm);if(this.currentPage==null){this.showPage(menuElm)}};Window.prototype.showPage=function(elm){if(this.currentPage!=null){this.currentPage.page.setVisible(false);this.currentPage.className=""}this.currentPage=elm;this.currentPage.page.setVisible(true);this.currentPage.className="selected"};