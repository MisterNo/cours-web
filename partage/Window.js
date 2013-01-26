var Window = function(id, parent){
	this.id = id;
	this.parent = parent;
	
	this.root = document.createElement("div");
	this.root.className = "window";
	this.parent.appendChild(this.root);
	
	this.menu = document.createElement("div");
	this.menu.className = "menu";
	this.root.appendChild(this.menu);
	
	this.menuList = document.createElement("ul");
	this.menuList.setAttribute("id", "main-menu");
	this.menu.appendChild(this.menuList);
	
	this.content = document.createElement("div");
	this.content.className = "content";
	this.root.appendChild(this.content);
	
	this.currentPage = null;
};
Window.prototype.addPage = function(title, page){
	if(!(page instanceof Page)){
		throw page + " is not instanceof Page";
	}
	var _this = this;
	this.content.appendChild(page.root);
	
	page.root.style.display = "none";
	
	var menuElm = document.createElement("li");
	menuElm.innerHTML = title;
	menuElm.page = page;
	
	menuElm.addEventListener("click", function(){
		_this.showPage(menuElm);
	});
	this.menuList.appendChild(menuElm);
	
	if(this.currentPage == null){
		this.showPage(menuElm);
	}
};

Window.prototype.showPage = function(elm){
	if(this.currentPage != null){
		this.currentPage.page.setVisible(false);
		this.currentPage.className = "";
	}
	this.currentPage = elm;
	this.currentPage.page.setVisible(true);
	this.currentPage.className = "selected";
};