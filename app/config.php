<?php
// Build cible
define('BUILD_TARGET', 'dev');
define('PROJECT_PATH', preg_replace('/[\/\\\][^\/\\\]+[\/\\\]?$/', '', __DIR__).'/');
define('VENDOR_PATH', PROJECT_PATH.'vendor/');
define('APP_PATH', PROJECT_PATH.'app/');
define('CONFIG_PATH', APP_PATH.'config/');
define('TEMPLATES_PATH', APP_PATH.'templates/');

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