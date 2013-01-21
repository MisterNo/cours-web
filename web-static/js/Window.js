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
	
	this.currentPage = false;
};
Window.prototype.addPage = function(title, page){
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
	
	if(this.menuList.childNodes.length == 1){
		this.showPage(menuElm);
	}
};
Window.prototype.showPage = function(elm){
	if(this.currentPage){
		this.currentPage.className = "";
		this.currentPage.page.root.style.display = "none";
	}
	this.currentPage = elm;
	this.currentPage.className = "selected";
	this.currentPage.page.root.style.display = "block";
};