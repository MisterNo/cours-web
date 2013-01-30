<?php
namespace coursWeb;

class User{
	
	private $id;
	private $login;
	private $xp = 0;
	private $hp = 0;
	private $power = 0;
	
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
		));
	}
	
	public function addXP($xpToAdd){
		$query = App::$db->prepare('UPDATE user SET xp=xp+? WHERE id=?');
		if($query->execute(array($xpToAdd, $this->id))){
			$query = App::$db->prepare('SELECT xp FROM user WHERE id=? LIMIT 1');
			if($query->execute(array($this->id))){
				$res = $query->fetch();
				if($res){
					$this->xp = $res->xp;
				}
			}
		}	
	}
	
	public function getXP(){
		return $this->xp;
	}
	
	public static function login($login, $password){
		$query = App::$db->prepare('SELECT * FROM user WHERE login=? AND password=SHA1(?) LIMIT 1');

		if($query->execute(array($login, $password))){
			$res = $query->fetch();
			if($res){
				$_SESSION['user'] = new User($res->id, $res->login, $res->xp, $res->hp, $res->power);
			}
		}
		return false;
	}
	
	public static function register($login, $password){
		$login = trim($login);
		$password = trim($password);
		if(strlen($login) < 3){
			throw new \Exception('Login too short (3 char min)');
		}
		if(strlen($password) < 5){
			throw new \Exception('Password too short (3 char min)');
		}
		$query = App::$db->prepare('SELECT id FROM user WHERE login=? LIMIT 1');
		if($query->execute(array($login))){
			$res = $query->fetch();
			if($res){
				throw new \Exception('Login already exists');
			}else{
				$query = App::$db->prepare('INSERT INTO user (login,password) VALUES (?,SHA1(?))');
				if($query->execute(array($login, $password))){
					if(!self::login($login, $password)){
						throw new \Exception('Registration failed');
					}
				}
			}
			return true;
		}
		return false;
	}
}