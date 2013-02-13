<?php
include 'common-header.tpl';
?>
<link rel="stylesheet" type="text/css" href="/cours-web-static/css/cours-web-min.css"/>
<script type="text/javascript">
<?php
echo 'var userData = '.$_SESSION['user']->toJSON().';';
?>
</script>
</head>
<body>
<div id="screen">
	<canvas width="1024" height="600" class="scene-view"></canvas>
	<div id="gui"></div>
</div>
</body>
</html>