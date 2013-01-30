<?php
include 'common-header.tpl';
?>
</head>
<body>
<?php
if(isset($_GET['register_error'])){
	echo 'Registration error : '.$_GET['register_error'];
}else if(isset($_GET['bad_login'])){
	echo 'Login/password incorrect';
}
?>
<form method="POST" action="<?php echo $_SERVER['PHP_SELF'];?>">
<label for="login">Login</label> <input type="text" id="login" name="login" value="<?php echo @$_GET['bad_login'];?>"/><br/>
<label for="password">Password</label> <input type="password" id="password" name="password"/><br/>
<input type="submit" value="Login" name="action-login"/>
<input type="submit" value="Register" name="action-register"/>
</form>
</body>
</html>