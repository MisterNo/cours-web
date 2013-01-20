<?php
// Build cible
define('BUILD_TARGET', 'dev');

define('CONFIG_PATH', __DIR__.'/config/');

// Import config commune
$d = opendir(CONFIG_PATH);
while($f = readdir($d)){
	if(substr($f, -4) == '.php'){
		include CONFIG_PATH.$f;
	}
}
closedir($d);

// Import config spécifique build cible
$d = opendir(CONFIG_PATH.BUILD_TARGET);
while($f = readdir($d)){
	if(substr($f, -4) == '.php'){
		include CONFIG_PATH.BUILD_TARGET.'/'.$f;
	}
}
closedir($d);