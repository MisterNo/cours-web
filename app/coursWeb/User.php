<?php
namespace coursWeb;

class User{
	
	private $id;
	private $login;
	private $xp = 0;
	private $hp = 0;
	private $power = 0;
	
	public $publicData = "ok";
	
	private function __construct($id, $login, $xp, $hp, $power){
		$this->id = (int)$id;
		$this->login = $login;
		$this->xp = (int)$xp;
		$this->hp = (int)$hp;
		$this->power = (int)$power;
	}
	
	public function toJSON(){
		return json_encode(array(
			'id' => $this->id,
			'login' => $this->login,
			'xp' => $this->xp,
			'hp' => $this->hp,
			'power' => $this->power,
			'test' => array(0, 2),
			'thisTest' => $this
		));
	}
	
	public function getXP(){
		return $this->xp;
	}
	
	public static function login($login, $password){
		$query = App::getDB()->prepare('SELECT * FROM user WHERE login=? LIMIT 1');
		if($query->execute(array($login))){
			$res = $query->fetch();
			if($res){
				if(\PasswordHashUtils::validate_password($password, $res->hash)){
					$_SESSION['user'] = new User($res->id, $res->login, $res->xp, $res->hp, $res->power);
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * Test
	 * @param unknown $login
	 * @param unknown $password
	 */
	public static function register($login, $password){
		echo 'registering '.$login.':'.$password;
		$query = App::getDB()->prepare('INSERT INTO user (login,hash) VALUES (?,?)');
		$param = array($login, \PasswordHashUtils::create_hash($password));
		if($query->execute($param)){
			// ok
		}
	}
}