<?php
namespace coursWeb;

use Facebook;

class App{
	
	private static $db = false;
	
	private static $fbApi = false;

	public static function getFbApi(){
		if(!self::$fbApi && defined('FB_APP_ID') && defined('FB_APP_SECRET')){
			self::$fbApi = new Facebook(array(
				'appId'  => FB_APP_ID,
				'secret' => FB_APP_SECRET,
			));
		}
		return self::$fbApi;
	}
	
	public static function getDB(){	
		if(self::$db === false){
			self::$db = new \PDO(DB_DRIVER.':host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASS);
			self::$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);
			self::$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ);
			self::$db->exec("SET CHARACTER SET utf8");
		}
		return self::$db;
	}

	public static function handleGameForm(){
		if(isset($_REQUEST['logout'])){
			session_destroy();
			header('Location: index.php');
		}
	}
	public static function handleConnectForm(){
		$db = self::getDB();
		$fbApi = self::getFbApi();
		if($fbApi){
			$userFbId = $fbApi->getUser();
			print_r($userFbId);
			if(!$userFbId){
				die('<script>top.location.href="http://www.facebook.com/dialog/oauth?client_id='.$fbApi->getAppId().'&scope='.FB_APP_SCOPE.'&redirect_uri='.urlencode(WEB_URI).'"</script>');
			}else{
				User::fbLogin($userFbId);
// 				Utils::debug($fbApi->getSignedRequest(), 'SignedRequest');
// 				Utils::debug($fbApi->api('/me'), '/me');
// 				die();
			}
		}else if(isset($_POST['action-login']) || isset($_POST['action-register'])){
			if(!isset($_POST['login'])){
				trigger_error('Missing login');
			}else if(!isset($_POST['password'])){
				trigger_error('Missing password');
			}else{
				$password = \AesCtr::decrypt($_POST['password'], '09ed931e1782289f8f9a42f837a46fa0', 256);
				if(isset($_POST['action-login'])){
					if(User::login($_POST['login'], $password)){
						header('Location: index.php');
					}else{
						header('Location: index.php?bad_login='.$_POST['login']);
					}
				}
				if(isset($_POST['action-register'])){
					User::register($_POST['login'], $password);
				}
			}
		}
	}
}