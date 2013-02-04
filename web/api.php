<?php
include('../app/config.php');

if(!isset($_SESSION['user'])){
	$result = array('error' => 'Session expired');
}else if(!isset($_REQUEST['d'])){
	$result = array('error' => 'Missing data');
}else{
	$requestData = json_decode(\AesCtr::decrypt($_REQUEST['d'], '09ed931e1782289f8f9a42f837a46fa0', 256));
	$result = array();
	if(!isset($requestData->action)){
		$result = array('error' => 'Missing action');
	}else{
		switch($requestData->action){
			case 'mobKill':
				$_SESSION['user']->addXP($requestData->data->killCount);
				$result = array('xp' => $_SESSION['user']->getXP());
				break;
		}
	}
}
echo \AesCtr::encrypt(json_encode($result), '09ed931e1782289f8f9a42f837a46fa0', 256);