<?php
include 'common-header.tpl';
?>
</head>
<body>
<?php
if(isset($_REQUEST['bad_login'])){
	echo 'Bad login or password';
}
?>
<form method="POST" id="connect-form" action="<?php echo $_SERVER['PHP_SELF'];?>" onsubmit="return encrypt()">
<label for="login">Login</label> <input type="text" id="login" name="login"/><br/>
<label for="password">Password</label> <input type="password" id="password" name="password"/><br/>
<input type="submit" value="Login" name="action-login"/>
<input type="submit" value="Register" name="action-register"/>
</form>
</body>
</html>