var infoPage;

function start(){
	console.log("ok");

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
	
	infoPage.refreshData({
		name: "Johnny",
		title: "be good",
		xp: 200,
		hp: 643,
		power: 65,
		progress: 0.8
	});
	scene = $("#main-scene");

	$("#gui").append($("<div>").button().append("Menu").click(function(){
		$(win.root).toggle('fade', 200);
	}));
	$(win.root).hide();
	
	player = new Player(scene);
	camera = new Camera(scene, player);

	player.setPosition(3530, 1770);
	player.init();
}