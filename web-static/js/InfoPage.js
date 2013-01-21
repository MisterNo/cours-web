var InfoPage = function(){
	Page.call(this, "");
	
	this.playerPreview = document.createElement("div");
	this.playerPreview.className = "player-preview";
	this.append(this.playerPreview);

	this.playerName = document.createElement("div");
	this.playerName.className = "player-name";
	this.append(this.playerName);
	
	this.playerTitle = document.createElement("div");
	this.playerTitle.className = "player-title";
	this.append(this.playerTitle);
	
	this.playerProgress = document.createElement("div");
	this.playerProgress.className = "player-progress";
	this.playerProgress.innerHTML = '<div class="player-progress-indic"></div>';
	this.append(this.playerProgress);
	
	this.attributeContainer = document.createElement("dl");
	this.append(this.attributeContainer);
	
	this.attributeList = {};
	this.addAttribute("xp", "XP");
	this.addAttribute("hp", "HP");
	this.addAttribute("power", "Puissance");
};
InfoPage.prototype = new Page();
InfoPage.prototype.refreshData = function(playerData){
	for(var i in playerData){
		switch(i){
		case "name":
			this.playerName.innerText = playerData.name;
			break;
		case "title":
			this.playerTitle.innerText = playerData.title;
			break;
		case "progress":
			this.playerProgressIndic.firstChild.style.width = Math.round(playerData.progress * 100) + '%';
			break;
		default:
			if(typeof this.attributeList[i] != "undefined"){
				this.attributeList[i].innerText = playerData[i];
			}
		}
	}
};
InfoPage.prototype.addAttribute = function(id, label){
	var dt = document.createElement("dt");
	dt.innerHTML = label;
	this.attributeContainer.appendChild(dt);
	
	var dd = document.createElement("dd");
	dd.className = id;
	this.attributeContainer.appendChild(dd);
	
	this.attributeList[id] = dd;
};