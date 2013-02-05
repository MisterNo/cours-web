<?php
include 'common-header.tpl';
?>
<link rel="stylesheet" type="text/css" href="/cours-web-static/css/base.css"/>
<link rel="stylesheet" type="text/css" href="/cours-web-static/css/scene.css"/>
<link rel="stylesheet" type="text/css" href="/cours-web-static/css/gui.css"/>
<link rel="stylesheet" type="text/css" href="/cours-web-static/css/infos.css"/>
<script type="text/javascript" src="/cours-web-static/js/Page.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Sprite.js"></script>
<script type="text/javascript" src="/cours-web-static/js/InfoPage.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Character.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Player.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Ennemy.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Camera.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Window.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Sprite.js"></script>
<script type="text/javascript" src="/cours-web-static/js/Game.js"></script>
<script type="text/javascript" src="/cours-web-static/js/AssetManager.js"></script>
<script type="text/javascript" src="/cours-web-static/js/main.js"></script>
<script type="text/javascript">
<?php
echo 'var userData = '.$_SESSION['user']->toJSON().';';
?>
</script>
</head>
<body onload="start()">
<div id="screen">
	<canvas width="1024" height="600" class="scene-view"></canvas>
	<div id="gui"></div>
</div>
</body>
</html>