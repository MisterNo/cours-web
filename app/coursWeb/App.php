<?php
namespace coursWeb;

class App{
	
	public static $db = false;
	
	public static function init(){
		if(self::$db === false){
			self::$db = new \PDO(DB_DRIVER.':host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASS);
			self::$db->exec("SET CHARACTER SET utf8");
			self::$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);
			self::$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ);
		}else{
			trigger_error('App already initialized');
		}
	}
	public static function handleGameForm(){
		if(isset($_GET['logout'])){
			session_destroy();
			header('Location: index.php');
		}	
	}
	
	public static function handleConnectForm(){
		global $db;
		if(isset($_POST['action-login'])){
			if(!isset($_POST['login'])){
				trigger_error('Missing login');
			}else if(!isset($_POST['password'])){
				trigger_error('Missing password');
			}else{
				if(User::login($_POST['login'], $_POST['password'])){
					header('Location: index.php');
				}else{
					header('Location: index.php?bad_login='.$_POST['login']);
				}
			}
		}
		if(isset($_POST['action-register'])){
			if(!isset($_POST['login'])){
				trigger_error('Missing login');
			}else if(!isset($_POST['password'])){
				trigger_error('Missing password');
			}else{
				try{
					User::register($_POST['login'], $_POST['password']);
				}catch(\Exception $e){
					header('Location: index.php?bad_login='.$_POST['login'].'&register_error='.urlencode($e->getMessage()));
				}
			}
		}
	}
}