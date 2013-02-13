<?php
include '../config.php';

function concat($dir, $output){
	$f = fopen($output, 'w');
	recursiveConcat($dir, $f);
	fclose($f);
}
function recursiveConcat($dir, $output){
	$d = opendir($dir);
	echo 'Browsing folder '.$dir.NL;
	while($f = readdir($d)){
		if(is_dir($dir.$f) && $f != '.' && $f != '..'){
			recursiveConcat($dir.$f.'/', $output);
		}else if(is_file($dir.$f)){
			echo 'Processing '.$f.NL;
			fwrite($output, file_get_contents($dir.$f));
		}
	}
	closedir($d);
	echo 'Folder '.$dir.' done'.NL;
}

echo 'Concat js...'.NL;
concat(STATIC_PATH.'src/js/', STATIC_PATH.'js/cours-web.js');
echo 'Concat done'.NL;

echo 'Minifying js...'.NL;
exec('uglifyjs -o '.STATIC_PATH.'js/cours-web-min.js '.STATIC_PATH.'js/cours-web.js');
echo 'Minifying done'.NL;
