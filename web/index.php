<?php
include('../app/config.php');

if(isset($_SESSION['user'])){
	coursWeb\App::handleGameForm();
	include TEMPLATES_PATH.'game.tpl';
}else{
	coursWeb\App::handleConnectForm();
	include TEMPLATES_PATH.'connect.tpl';
}