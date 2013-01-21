var IMG_PATH = "/cours-web-static/img/";
var infosPage;
function start(){
	console.log("ok");

	var win = new Window('main-window', document.getElementById("gui"));
	infosPage = new InfoPage();
	win.addPage("infos", infosPage);
	win.addPage("description", new Page("blabla"));
	win.addPage("equipement", new Page("lorem ipsum"));
	
	infosPage.refreshData({
		name: "Ulrich",
		title: "Samouraï",
		xp: 200,
		hp: 120,
		power: 42
	});
//	var player = new Character();
//	player.setPosition(3530, 1770);
}